module.exports = {
    siteMetadata: {
        title: `Moore Reduction Procedure`,
        author: `Martin Kröning`,
        description: `A web app performing the Moore reduction procedure.`,
        siteUrl: `https://mkroening.github.io/moore-reduction/`,
    },
    pathPrefix: `/moore-reduction`,
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Moore Reduction Procedure`,
                short_name: `Moore Reduction`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#4352af`,
                display: `standalone`,
                icon: `src/images/icon.png`,
            },
        },
        `gatsby-plugin-offline`,
    ],
};
