import React from 'react'
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return ( 
    <Layout>
      <Component {...pageProps}/>
    </Layout>
  )
}
