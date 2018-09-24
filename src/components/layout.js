import {graphql, StaticQuery} from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import 'typeface-roboto';

const Layout = ({data, children}) => (
    <>
        <Helmet>
            <html lang="en"/>
            <meta charSet="utf-8"/>
            <title>{data.site.siteMetadata.title}</title>
            <meta name="author" content={data.site.siteMetadata.author}/>
            <meta name="description" content={data.site.siteMetadata.description}/>
            <link rel="canonical" href={data.site.siteMetadata.siteUrl}/>
        </Helmet>
        {children}
    </>
);

export default props => (
    <StaticQuery
        query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
            author
            description
            siteUrl
          }
        }
      }
    `}
        render={data => <Layout data={data} {...props} />}
    />
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    data: PropTypes.shape({
        site: PropTypes.shape({
            siteMetadata: PropTypes.shape({
                title: PropTypes.string.isRequired,
                author: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                siteUrl: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
};
