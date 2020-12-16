import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import App from 'next/app'
import Head from 'next/head'
import UserContextProvider from '../contexts/user'
import CharacterContextProvider from '../contexts/CharacterContext'
import StoreProvider from '../contexts/StoreContext'
import ErrorPage from '../components/ErrorPage'
// import { request } from '../utils/requests'
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

String.prototype.toTitleCase = function () {
  let articles = ['a', 'an', 'the', 'or', 'and']
  let words = []
  let strArr = this.toLowerCase().replace(/_/g, ' ').split(' ');
  for (let i=0; i<strArr.length; i++) {
    let word = strArr[i]
    if (articles.includes(word)) {
      if (i > 0) {
        words.push(word)
        continue
      }
    }
    words.push(word.replace(word[0], word[0].toUpperCase()))
  }
  return words.join(' ')
}

export default function MyApp ({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
    >
    <div>
      <Head>
        <title>DnD Database</title>
      </Head>
      <CharacterContextProvider>
      <UserContextProvider>
      <StoreProvider>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </StoreProvider>
      </UserContextProvider>
      </CharacterContextProvider>
    </div>
    </ErrorBoundary>
  )
}
