import { useState } from "react";
import Head from "next/head";

import Button from "@material-ui/core/Button";
import RecipeItem from "./RecipeItem";
import Typography from "@material-ui/core/Typography";
import getRecipeRows, { Starter, Yeast } from "../utils/getRecipeRows";
import SettingsDialog from "./SettingsDialog";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [ovenTemp, setOvenTemp] = useState(550);
  const [pieCount, setPieCount] = useState(3);
  const [pieSize, setPieSize] = useState(16);
  const [useMalt, setUseMalt] = useState(true);
  const [nightsAging, setNightsAging] = useState(1);
  const [yeastType, setYeastType] = useState<Yeast>(Yeast.Active);
  const [starter, setStarter] = useState<Starter>(Starter.Levain);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const recipeRows = getRecipeRows({
    ovenTemp,
    pieCount,
    pieSize,
    starter,
    useMalt,
    nightsAging,
    yeastType,
  });
  const settingsProps = {
    open,
    handleClose,
    ovenTemp,
    setOvenTemp,
    pieCount,
    setPieCount,
    starter,
    setStarter,
    pieSize,
    setPieSize,
    useMalt,
    setUseMalt,
    nightsAging,
    setNightsAging,
    yeastType,
    setYeastType,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Oaktown Pizza ~ Dough Calculator</title>

        <link rel="icon" href="/favicon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <img
            src="/favicon.svg"
            height="30px"
            width="30px"
            style={{ marginRight: 8 }}
          />
          Oaktown Pizza
        </h1>
      </header>

      <main className={styles.main}>
        <Typography variant="h1">Dough Calculator</Typography>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Configure Your Pizza Game
        </Button>
        <SettingsDialog {...settingsProps} />

        {recipeRows.map(({ title, subtitle, rows }) => (
          <RecipeItem
            key={title}
            title={title}
            subtitle={subtitle}
            rows={rows}
          />
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Whole Milk Mozzerella
        </a>
      </footer>
    </div>
  );
}
