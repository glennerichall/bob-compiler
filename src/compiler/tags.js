// TODO: Permettre de fournir les tags par variable d'environnement

const error = '(?:Err(?:eur)?|Non|Interdit):?';
const assertion = '(?:Ok|V[ée]rif(?:i[ée])?|Appr(?:ouvé)?):?';
const combined = `(?:${error}|${assertion})`;

module.exports = {
    error,
    assertion,
    combined
};