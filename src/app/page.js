import Image from "next/image";
import styles from "./page.module.css";
import Orb from "./components/Orb";

export default function Home() {
  return (
    <div className="app">
      <nav>
        <h1>NEXT-ORB</h1>
      </nav>

      <Orb />

      <footer>
        <p>[ ARCHIEVE BEYOND REALITY ]</p>
      </footer>
    </div>
  );
}
