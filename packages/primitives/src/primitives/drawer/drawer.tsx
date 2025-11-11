import * as React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  type ViewProps,
  View,
} from "react-native";
import { Slot } from "../slot";

// Default animation config constants
const DEFAULT_ANIMATION = {
  OPEN: {
    BACKDROP_DURATION: 180,
    SPRING_VELOCITY: 3,
    SPRING_TENSION: 120,
    SPRING_FRICTION: 22,
  },
  CLOSE: {
    SPRING_FRICTION: 26,
    SPRING_TENSION: 100,
    SPRING_VELOCITY: 0.5,
    BACKDROP_DURATION: 280,
    BACKDROP_DELAY: 100,
  },
  SNAP: {
    SPRING_TENSION: 120,
    SPRING_FRICTION: 22,
  },
};

// Default drag behavior constants
const DEFAULT_DRAG = {
  THRESHOLD: 5,
  CLOSE_DISTANCE: 100,
  VELOCITY_THRESHOLD: {
    UP: 0.3,
    DOWN: 0.5,
  },
  RESISTANCE: 0.1,
  SCROLL_THRESHOLD: 10,
};

export type AnimationConfig = {
  OPEN?: Partial<typeof DEFAULT_ANIMATION.OPEN>;
  CLOSE?: Partial<typeof DEFAULT_ANIMATION.CLOSE>;
  SNAP?: Partial<typeof DEFAULT_ANIMATION.SNAP>;
};

export type DragConfig = {
  THRESHOLD?: number;
  CLOSE_DISTANCE?: number;
  VELOCITY_THRESHOLD?: {
    UP?: number;
    DOWN?: number;
  };
  RESISTANCE?: number;
  SCROLL_THRESHOLD?: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type DrawerContextValue = {
  close: () => void;
  snapTo: (index: number) => void;
  currentSnapIndex: number;
  snapPoints: number[];
  isClosing: boolean;
  isAnimating: boolean;
  position: Animated.Value;
  panHandlers?: ReturnType<typeof PanResponder.create>["panHandlers"];
  handlePanHandlers?: ReturnType<typeof PanResponder.create>["panHandlers"];
  canScrollContent: React.MutableRefObject<boolean>;
  scrollableRef: React.MutableRefObject<ScrollView | null>;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer");
  }
  return context;
}

export function useDrawer() {
  return useDrawerContext();
}

export type DrawerProps = ViewProps & {
  /**
   * Whether the drawer is open (controlled).
   */
  open?: boolean;

  /**
   * Default open state (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Snap points for the drawer height (in pixels or percentages).
   * Values between 0-1 are treated as percentages, otherwise pixels.
   */
  snapPoints?: number[];

  /**
   * Initial snap point index (0-based).
   */
  initialSnapIndex?: number;

  /**
   * Callback when snap point changes.
   */
  onSnapChange?: (index: number) => void;

  /**
   * Whether the drawer can be dismissed by tapping the backdrop.
   */
  dismissible?: boolean;

  /**
   * Whether the drawer can be resized by dragging.
   */
  resizable?: boolean;

  /**
   * Whether to avoid keyboard on iOS.
   */
  avoidKeyboard?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * Custom animation configuration.
   * Allows overriding default animation timings and spring physics.
   */
  animationConfig?: AnimationConfig;

  /**
   * Custom drag behavior configuration.
   * Allows overriding default drag thresholds and resistance.
   */
  dragConfig?: DragConfig;
};

/**
 * Drawer root component.
 * Manages open/closed state and provides context to children.
 *
 * @example
 * <Drawer snapPoints={[0.3, 0.6, 0.9]}>
 *   <DrawerOverlay />
 *   <DrawerContent>
 *     <DrawerHandle />
 *     <Text>Drawer content</Text>
 *   </DrawerContent>
 * </Drawer>
 */
export const Drawer = React.forwardRef<View, DrawerProps>((props, ref) => {
  const {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    snapPoints = [0.5],
    initialSnapIndex = 0,
    onSnapChange,
    dismissible = true,
    resizable = true,
    avoidKeyboard = true,
    asChild,
    animationConfig,
    dragConfig,
    children,
    ...rest
  } = props;

  // Merge animation configs with defaults
  const ANIMATION = React.useMemo(
    () => ({
      OPEN: { ...DEFAULT_ANIMATION.OPEN, ...animationConfig?.OPEN },
      CLOSE: { ...DEFAULT_ANIMATION.CLOSE, ...animationConfig?.CLOSE },
      SNAP: { ...DEFAULT_ANIMATION.SNAP, ...animationConfig?.SNAP },
    }),
    [animationConfig]
  );

  // Merge drag configs with defaults
  const DRAG = React.useMemo(
    () => ({
      ...DEFAULT_DRAG,
      ...dragConfig,
      VELOCITY_THRESHOLD: {
        ...DEFAULT_DRAG.VELOCITY_THRESHOLD,
        ...dragConfig?.VELOCITY_THRESHOLD,
      },
    }),
    [dragConfig]
  );

  const [isVisible, setIsVisible] = React.useState(false);
  const [dimensions, setDimensions] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const screenHeight = dimensions.height || SCREEN_HEIGHT;

  const snapPointsPixels = React.useMemo(
    () =>
      snapPoints.map((point) => {
        if (point <= 1) {
          return screenHeight - screenHeight * point;
        }
        return screenHeight - Math.min(point, screenHeight);
      }),
    [snapPoints, screenHeight]
  );

  const activeSnapIndex = React.useRef(initialSnapIndex);
  const translateY = React.useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const isClosing = React.useRef(false);
  const isAnimating = React.useRef(false);
  const hasInitializedOpen = React.useRef(false);

  // Uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const animateOpen = React.useCallback(() => {
    if (isAnimating.current) {
      translateY.stopAnimation();
      backdropOpacity.stopAnimation();
    }

    isAnimating.current = true;
    translateY.setValue(screenHeight);
    backdropOpacity.setValue(0);
    isClosing.current = false;

    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: ANIMATION.OPEN.BACKDROP_DURATION,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

    const targetTranslation = snapPointsPixels[initialSnapIndex] ?? snapPointsPixels[0] ?? 0;
    Animated.spring(translateY, {
      toValue: targetTranslation,
      useNativeDriver: true,
      velocity: ANIMATION.OPEN.SPRING_VELOCITY,
      tension: ANIMATION.OPEN.SPRING_TENSION,
      friction: ANIMATION.OPEN.SPRING_FRICTION,
    }).start(() => {
      isAnimating.current = false;
      activeSnapIndex.current = initialSnapIndex;
    });
  }, [backdropOpacity, translateY, snapPointsPixels, initialSnapIndex, screenHeight, ANIMATION]);

  const animateClose = React.useCallback(() => {
    if (isClosing.current) return;

    isClosing.current = true;

    if (isAnimating.current) {
      translateY.stopAnimation();
      backdropOpacity.stopAnimation();
    }

    isAnimating.current = true;

    Animated.spring(translateY, {
      toValue: screenHeight,
      useNativeDriver: true,
      friction: ANIMATION.CLOSE.SPRING_FRICTION,
      tension: ANIMATION.CLOSE.SPRING_TENSION,
      velocity: ANIMATION.CLOSE.SPRING_VELOCITY,
    }).start();

    Animated.timing(backdropOpacity, {
      toValue: 0,
      duration: ANIMATION.CLOSE.BACKDROP_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
      delay: ANIMATION.CLOSE.BACKDROP_DELAY,
    }).start(() => {
      requestAnimationFrame(() => {
        setIsVisible(false);
        isClosing.current = false;
        isAnimating.current = false;
        hasInitializedOpen.current = false;
        handleOpenChange(false);
      });
    });
  }, [backdropOpacity, translateY, screenHeight, handleOpenChange, ANIMATION]);

  React.useEffect(() => {
    if (open && !isVisible) {
      setIsVisible(true);
      return;
    }

    if (open && isVisible && !hasInitializedOpen.current && !isClosing.current) {
      animateOpen();
      hasInitializedOpen.current = true;
      return;
    }

    if (!open && isVisible && !isClosing.current) {
      animateClose();
    }
  }, [open, isVisible, animateOpen, animateClose]);

  const handleBackdropPress = React.useCallback(() => {
    if (dismissible && !isClosing.current) {
      animateClose();
    }
  }, [dismissible, animateClose]);

  const animateToSnapPoint = React.useCallback(
    (index: number, velocity = 0) => {
      if (
        index < 0 ||
        index >= snapPointsPixels.length ||
        isAnimating.current
      )
        return;

      isAnimating.current = true;
      activeSnapIndex.current = index;
      onSnapChange?.(index);

      const targetTranslation = snapPointsPixels[index] ?? 0;
      Animated.spring(translateY, {
        toValue: targetTranslation,
        useNativeDriver: true,
        velocity: velocity,
        tension: ANIMATION.SNAP.SPRING_TENSION,
        friction: ANIMATION.SNAP.SPRING_FRICTION,
      }).start(() => {
        isAnimating.current = false;
      });
    },
    [snapPointsPixels, onSnapChange, translateY, ANIMATION]
  );

  const getTargetSnapIndex = React.useCallback(
    (currentY: number, velocity: number, dragDirection: "up" | "down") => {
      const isDraggingDown = dragDirection === "down";

      if (
        activeSnapIndex.current === snapPointsPixels.length - 1 &&
        isDraggingDown
      ) {
        return snapPointsPixels.length - 2 >= 0
          ? snapPointsPixels.length - 2
          : 0;
      }

      if (
        activeSnapIndex.current === 1 &&
        isDraggingDown &&
        velocity > DRAG.VELOCITY_THRESHOLD.UP
      ) {
        return 0;
      }

      if (
        activeSnapIndex.current === 0 &&
        isDraggingDown &&
        velocity > DRAG.VELOCITY_THRESHOLD.DOWN
      ) {
        return -1;
      }

      if (currentY > (snapPointsPixels[0] ?? 0) + DRAG.CLOSE_DISTANCE) {
        return -1;
      }

      if (dragDirection === "up" && velocity > DRAG.VELOCITY_THRESHOLD.UP) {
        const nextIndex = Math.min(
          activeSnapIndex.current + 1,
          snapPointsPixels.length - 1
        );
        return nextIndex;
      }

      let closestIndex = 0;
      const firstSnap = snapPointsPixels[0] ?? 0;
      let minDistance = Math.abs(currentY - firstSnap);

      for (let i = 1; i < snapPointsPixels.length; i++) {
        const snapPoint = snapPointsPixels[i] ?? 0;
        const distance = Math.abs(currentY - snapPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      return closestIndex;
    },
    [snapPointsPixels, DRAG]
  );

  const canScrollContent = React.useRef(false);
  const scrollableRef = React.useRef<ScrollView | null>(null);
  const dragStartY = React.useRef(0);
  const isDragging = React.useRef(false);

  // PanResponder for handle - always active
  const handlePanResponder = React.useMemo(() => {
    if (!resizable || snapPointsPixels.length === 0) return null;

    const maxDragPoint = snapPointsPixels[snapPointsPixels.length - 1] ?? 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: () =>
        !isClosing.current && !isAnimating.current,
      onMoveShouldSetPanResponder: () =>
        !isClosing.current && !isAnimating.current,

      onPanResponderGrant: () => {
        translateY.stopAnimation();
        isAnimating.current = false;
        isDragging.current = true;
      },

      onPanResponderMove: (_, { dy }) => {
        if (isClosing.current) return;

        const currentSnapY = snapPointsPixels[activeSnapIndex.current] ?? 0;
        let newY = currentSnapY + dy;

        if (maxDragPoint > 0 && newY < maxDragPoint) {
          const overscroll = maxDragPoint - newY;
          const resistedOverscroll =
            -Math.log10(1 + overscroll * DRAG.RESISTANCE) * 10;
          newY = maxDragPoint + resistedOverscroll;
        }

        translateY.setValue(newY);
      },

      onPanResponderRelease: (_, { dy, vy }) => {
        isDragging.current = false;
        if (isClosing.current) return;

        const dragDirection = dy > 0 ? "down" : "up";
        const currentY = (snapPointsPixels[activeSnapIndex.current] ?? 0) + dy;
        const absVelocity = Math.abs(vy);

        const targetIndex = getTargetSnapIndex(
          currentY,
          absVelocity,
          dragDirection
        );

        if (targetIndex === -1) {
          animateClose();
        } else {
          animateToSnapPoint(targetIndex, vy);
        }
      },
    });
  }, [
    snapPointsPixels,
    animateClose,
    animateToSnapPoint,
    getTargetSnapIndex,
    resizable,
    translateY,
    DRAG,
  ]);

  // PanResponder for content - conditional based on scroll state
  const contentPanResponder = React.useMemo(() => {
    if (!resizable || snapPointsPixels.length === 0) return null;

    const maxDragPoint = snapPointsPixels[snapPointsPixels.length - 1] ?? 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        if (isClosing.current || isAnimating.current) return false;
        dragStartY.current = evt.nativeEvent.pageY;
        return false; // Let scroll handle it first
      },

      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isClosing.current || isAnimating.current) return false;

        const { dy } = gestureState;
        const absDy = Math.abs(dy);

        // Always allow drag up (to expand drawer)
        if (dy < 0 && absDy > DRAG.THRESHOLD) {
          return true;
        }

        // Allow drag down only if:
        // 1. Content can't scroll OR
        // 2. Content is at top (scrollTop === 0) AND dragging down
        if (dy > 0 && absDy > DRAG.THRESHOLD) {
          // If content can scroll and is scrolled, let scroll handle it
          if (canScrollContent.current) {
            return false;
          }
          return true; // Allow drag down when content is at top or can't scroll
        }

        return false;
      },

      onPanResponderGrant: () => {
        translateY.stopAnimation();
        isAnimating.current = false;
        isDragging.current = true;
      },

      onPanResponderMove: (_, { dy }) => {
        if (isClosing.current || !isDragging.current) return;

        const currentSnapY = snapPointsPixels[activeSnapIndex.current] ?? 0;
        let newY = currentSnapY + dy;

        if (maxDragPoint > 0 && newY < maxDragPoint) {
          const overscroll = maxDragPoint - newY;
          const resistedOverscroll =
            -Math.log10(1 + overscroll * DRAG.RESISTANCE) * 10;
          newY = maxDragPoint + resistedOverscroll;
        }

        translateY.setValue(newY);
      },

      onPanResponderRelease: (_, { dy, vy }) => {
        isDragging.current = false;
        if (isClosing.current) return;

        const dragDirection = dy > 0 ? "down" : "up";
        const currentY = (snapPointsPixels[activeSnapIndex.current] ?? 0) + dy;
        const absVelocity = Math.abs(vy);

        const targetIndex = getTargetSnapIndex(
          currentY,
          absVelocity,
          dragDirection
        );

        if (targetIndex === -1) {
          animateClose();
        } else {
          animateToSnapPoint(targetIndex, vy);
        }
      },

      onPanResponderTerminationRequest: () => {
        // Allow scroll to take over if needed
        return !isDragging.current;
      },
    });
  }, [
    snapPointsPixels,
    animateClose,
    animateToSnapPoint,
    getTargetSnapIndex,
    resizable,
    translateY,
    DRAG,
  ]);

  const contextValue = React.useMemo(
    () => ({
      close: animateClose,
      snapTo: animateToSnapPoint,
      currentSnapIndex: activeSnapIndex.current,
      snapPoints: snapPoints.map((point) => {
        if (point <= 1) {
          return point;
        }
        return point / screenHeight;
      }),
      isClosing: isClosing.current,
      isAnimating: isAnimating.current,
      position: translateY,
      panHandlers: contentPanResponder?.panHandlers,
      handlePanHandlers: handlePanResponder?.panHandlers,
      canScrollContent,
      scrollableRef,
    }),
    [
      animateClose,
      animateToSnapPoint,
      snapPoints,
      screenHeight,
      translateY,
      contentPanResponder?.panHandlers,
      handlePanResponder?.panHandlers,
    ]
  );

  const renderContent = React.useCallback(
    () => (
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          {dismissible && (
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateY }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    ),
    [
      backdropOpacity,
      dismissible,
      handleBackdropPress,
      translateY,
      children,
    ]
  );

  if (!isVisible) return null;

  const Comp = asChild ? Slot : View;

  return (
    <DrawerContext.Provider value={contextValue}>
      <Comp ref={ref} {...rest}>
        <Modal
          visible={isVisible}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={dismissible ? animateClose : undefined}
        >
          {avoidKeyboard && Platform.OS === "ios" ? (
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1 }}
              keyboardVerticalOffset={10}
            >
              {renderContent()}
            </KeyboardAvoidingView>
          ) : (
            renderContent()
          )}
        </Modal>
      </Comp>
    </DrawerContext.Provider>
  );
});

Drawer.displayName = "Drawer";

/* ---------------------------------- DrawerHandle ---------------------------------- */

export type DrawerHandleProps = ViewProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Drawer handle component.
 * Visual indicator for dragging/resizing the drawer.
 *
 * @example
 * <DrawerHandle>
 *   <View style={styles.handle} />
 * </DrawerHandle>
 */
export const DrawerHandle = React.forwardRef<View, DrawerHandleProps>(
  (props, ref) => {
    const { asChild, children, style, ...rest } = props;
    const context = useDrawerContext();
    const { handlePanHandlers } = context;

    const Comp = asChild ? Slot : View;

    return (
      <Comp
        ref={ref}
        style={style}
        {...(handlePanHandlers || {})}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

DrawerHandle.displayName = "DrawerHandle";

/* ---------------------------------- DrawerContent ---------------------------------- */

export type DrawerContentProps = ViewProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * Force mount the content even when closed (useful for animations).
   */
  forceMount?: boolean;
};

/**
 * Drawer content container.
 * Positioned at the bottom with animated height.
 *
 * @example
 * <DrawerContent>
 *   <Text>Drawer content</Text>
 * </DrawerContent>
 */
export const DrawerContent = React.forwardRef<View, DrawerContentProps>(
  (props, ref) => {
    const { asChild, children, style, ...rest } = props;
    const context = useDrawerContext();
    const { panHandlers, scrollableRef, canScrollContent } = context;

    const Comp = asChild ? Slot : View;

    // Wrap children to detect ScrollView and enable scroll detection
    const wrappedChildren = React.useMemo(() => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === ScrollView) {
          const childProps = child.props as React.ComponentProps<typeof ScrollView>;
          const originalOnScroll = childProps.onScroll;
          
          return React.cloneElement(child as React.ReactElement<React.ComponentProps<typeof ScrollView>>, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref: (node: ScrollView | null) => {
              scrollableRef.current = node;
            },
            onScroll: (e: Parameters<NonNullable<React.ComponentProps<typeof ScrollView>["onScroll"]>>[0]) => {
              const nativeEvent = e.nativeEvent as { contentOffset: { y: number } };
              canScrollContent.current = nativeEvent.contentOffset.y > 0;
              originalOnScroll?.(e);
            },
            scrollEventThrottle: 16,
          } as Partial<React.ComponentProps<typeof ScrollView>>);
        }
        return child;
      });
    }, [children, scrollableRef, canScrollContent]);

    return (
      <Comp
        ref={ref}
        style={style}
        {...(panHandlers || {})}
        {...rest}
      >
        {wrappedChildren || children}
      </Comp>
    );
  }
);

DrawerContent.displayName = "DrawerContent";

/* ---------------------------------- DrawerOverlay ---------------------------------- */

export type DrawerOverlayProps = {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Drawer overlay component.
 * Backdrop that appears behind the drawer.
 *
 * @example
 * <DrawerOverlay />
 */
export const DrawerOverlay = React.forwardRef<View, DrawerOverlayProps>(
  (props, ref) => {
    const { asChild, ...rest } = props;

    const Comp = asChild ? Slot : View;

    return <Comp ref={ref} {...rest} />;
  }
);

DrawerOverlay.displayName = "DrawerOverlay";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  drawerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 24,
    overflow: "hidden",
  },
});
