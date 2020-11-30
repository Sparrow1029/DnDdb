import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import UserContextProvider from '../contexts/user'
import CharacterContextProvider from '../contexts/character'
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

String.prototype.toTitleCase = function () {
  var str = this.toLowerCase().split(' ');
  return str.map(word => {return word.replace(word[0], word[0].toUpperCase())}).join(' ')
}

export default function MyApp ({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <div>
      <Head>
        <title>DnD Database</title>
      </Head>
      <CharacterContextProvider><UserContextProvider>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </UserContextProvider></CharacterContextProvider>
    </div>
  )
}
