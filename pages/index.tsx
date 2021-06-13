import React from 'react'
import Head from 'next/head'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ProductsTable } from '@/components'
import styles from '@/styles/Home.module.css'
// TODO uncomment the line below to import the API calls
import { getProductProperties, getProducts } from '@/api/products'

export async function getStaticProps(): Promise<{ props }> {
  // TODO call getProductProperties and getProducts from '@/api/products'
  // and return the data in order to receive it in the `Home` component
  const [products, properties] = await Promise.all([getProducts(), getProductProperties()])

  return {
    props: {
      // TODO products and product properties data
      properties,
      products
    }
  }
}

export interface HomeProps {
  properties: string[]
  products: string[]
}

export default function Home({ properties, products }: HomeProps) {
  // TODO consume the products and product properties data coming from `getStaticProps`

  const theme = createMuiTheme({ palette: { type: 'dark' } })
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.container}>
        <Head>
          <title>Healthy Foods</title>
          <meta name="description" content="Healthy Foods Challenge" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Healthy Foods</h1>
          <p className={styles.description}>
            A comprehensive inventory of all the <code>Healthy Foods</code> in our store
          </p>
          {/* TODO: implement the rest of the functionality starting in ProductsTable component */}
          <ProductsTable productProperties={properties} products={products} />
        </main>
      </div>
    </ThemeProvider>
  )
}
