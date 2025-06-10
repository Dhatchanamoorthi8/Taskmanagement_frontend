import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html lang='en'>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Open+Sans&family=Poppins&family=Lato&family=Nunito&family=Raleway&family=Work+Sans&family=DM+Sans&family=Manrope&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
