import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{ url: string }>((import('swagger-ui-react') as any), {
  ssr: false,
});

export default function Index() {
  return (
    <div>
      <Head>
        <title>Pinax Cryptostats API</title>
        <meta name="description" content="Pinax Cryptostats API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SwaggerUI url="/api/swagger.json" />
    </div>
  );
}