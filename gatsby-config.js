module.exports = {
    pathPrefix: `/moore-reduction`,
};

plugins: [
    {
        resolve: `gatsby-plugin-manifest`,
        options: {
            name: `moore-reduction`,
            short_name: `moore`,
            start_url: `/moore-reduction/`,
            scope: `/moore-reduction/`,
            background_color: `#ffffff`,
            theme_color: `#4352af`,
            display: `standalone`,
            icon: `src/images/icon.png`,
        },
    },
    `gatsby-plugin-offline`,
]
