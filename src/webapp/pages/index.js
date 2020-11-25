import Head from 'next/head'
import styles from '../styles/Global.module.css'
import NavSidebar from '../components/sidenav'
import LoginForm from '../components/loginForm'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <NavSidebar>
        <h1 className={styles.title}>
          Welcome to DnDdb!
        </h1>
        <div style={{padding: "100px 0 100px 0"}}></div>
        <LoginForm />
      </NavSidebar>

    </div>
  )
}
