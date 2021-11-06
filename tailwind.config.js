module.exports = {
    purge: ['./src/**/*.vue'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'kenway-teal': '#26c2eb',
                'kenway-teal-dark': '#1b4d6e',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
