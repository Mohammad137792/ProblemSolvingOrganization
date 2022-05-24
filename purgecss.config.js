const TailwindExtractor = content => content.match(/[A-Za-z0-9-_:\/]+/g) || [];

module.exports = {
    content   : ['./src/**/*.js', './src/**/*.jsx'],
    css       : ['./src/styles/tailwind.css'],
    whitelist : ["ltr:pl-24", "ltr:pl-40", "ltr:pl-56", "ltr:pl-72", "ltr:pl-80", "rtl:pr-24", "rtl:pr-40", "rtl:pr-56", "rtl:pr-72", "rtl:pr-80"],
    extractors: [
        {
            extractor : TailwindExtractor,
            extensions: ["html", "js", "jsx"]
        }
    ]
}