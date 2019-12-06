// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Main, NextScript } from 'next/document'

class MicroFrontendDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
    <div>
        <NextScript/>
        <Main />
    </div>
    )
  }
}

export default MicroFrontendDocument