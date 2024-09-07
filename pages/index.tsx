import Head from "next/head";
import WebcamOverlay from "../components/WebcamOverlay";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
      <div className={styles.container}>
        <Head>
          <title>お面アプリ</title>
          <meta name="description" content="リアルタイムで顔の上にお面を表示するアプリ" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            お面アプリ 🎭
          </h1>
          <WebcamOverlay />
        </main>
      </div>
  );
}
