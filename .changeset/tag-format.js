/**
 * Custom tag format for GitHub releases
 * Transforms @native-ui-org/primitives@1.0.0 -> primitives@1.0.0
 */
module.exports = (packageName, version) => {
    const shortName = packageName.replace('@native-ui-org/', '');
    return `${shortName}@${version}`;
};

