import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'swagger-ui-react/swagger-ui.css';
import { title, description } from "@utils/constants";

const SwaggerUI = dynamic<{ url: string }>((import('swagger-ui-react') as any), {
  ssr: false,
});

export default function Index() {
  return (
    <div>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description } />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SwaggerUI url="/api/swagger.json" />
    </div>
  );
}