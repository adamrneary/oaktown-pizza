import compact from "lodash/compact";

export enum Starter {
  Levain = "Levain",
  Poolish = "Poolish",
  Biga = "Biga",
  None = "None",
}

export enum Yeast {
  Active = "Active Dry Yeast",
  Instant = "Instant Yeast",
  Fresh = "Fresh (Brewer's Yeast",
  Levain = "Levain Culture",
}

// We leave a little dough behind in the tub.
// This is the planned overage to account for this
const FUDGE_FACTOR = 1.01;

// Multiplier to apply to base yeast BP for calculating starter yeast weight
const STARTER_YEAST_MULTIPLIER = 0.4628099174;

type Recipe = {
  // Total starter expressed as % of final recipe flour (not precisely BP)
  starter?: number;

  // Water expressed as % of starter flour
  starterHydration?: number;

  // Levain Culture expressed as % of starter flour
  starterLevain?: number;
};

const recipes: {
  [key in Starter]: Recipe;
} = {
  [Starter.Levain]: {
    starterHydration: 100,
    starterLevain: 50,
  },
  [Starter.Poolish]: {
    starter: 20,
    starterHydration: 100,
  },
  [Starter.Biga]: {
    starter: 20,
    starterHydration: 70,
  },
  [Starter.None]: {},
};

const SALT_BP = 2.8;

function getOilBP(ovenTemp: number) {
  if (ovenTemp > 900) {
    return 0;
  }
  if (ovenTemp < 450) {
    return 2;
  }

  // Linear regression based on the above two values;
  return 4.0 - 0.004444 * ovenTemp;
}

function getHydration(ovenTemp: number) {
  if (ovenTemp > 900) {
    return 57;
  }
  if (ovenTemp < 450) {
    return 65;
  }

  // Linear regression based on the above two values;
  return 73.0 - 0.01778 * ovenTemp;
}

const BASE_YEAST_VOLUME = {
  [Yeast.Active]: 0.55,
  [Yeast.Instant]: 0.45,
  [Yeast.Fresh]: 1.2,
  [Yeast.Levain]: 10.5,
};

function getYeastBP(yeastType, nightsAging, starter) {
  const baseYeast =
    BASE_YEAST_VOLUME[starter === Starter.Levain ? Yeast.Levain : yeastType];
  return baseYeast + baseYeast * 0.1 * nightsAging;
}

type Inputs = {
  ovenTemp: number;
  pieCount: number;
  pieSize: number;
  starter: Starter;
  useMalt: boolean;
  nightsAging: number;
  yeastType: Yeast;
};

function asBakersPercent(n: number) {
  if (n >= 10) {
    return `${Math.round(n)}%`;
  }
  return `${n.toFixed(1)}%`;
}

function asGrams(n: number, precision?: number) {
  return `${n.toFixed(precision)}g`;
}

export default function getRecipeRows({
  ovenTemp,
  pieCount,
  pieSize,
  starter,
  useMalt,
  nightsAging,
  yeastType,
}: Inputs) {
  const rows: {
    title: string;
    subtitle?: string;
    rows: {
      item: string;
      weightG: string;
      bakersPercent: string;
    }[];
  }[] = [];
  // Note: Linear regression on [{10,200}, {12,280}, {16,400}]
  const ballWeight = -122.9 + 32.86 * pieSize;
  const totalWeight = pieCount * ballWeight * FUDGE_FACTOR;
  const recipe = recipes[starter];
  const oilBP = getOilBP(ovenTemp);
  const hydration = getHydration(ovenTemp);
  const yeastBp = getYeastBP(yeastType, nightsAging, starter);

  const flourWeight =
    (totalWeight * 100) / (100 + hydration + SALT_BP + yeastBp + oilBP);
  const waterWeight = flourWeight * (hydration / 100.0);
  const saltWeight = flourWeight * (SALT_BP / 100.0);
  const yeastWeight = flourWeight * (yeastBp / 100.0);
  const oilWeight = flourWeight * (oilBP / 100.0);

  let starterWeight;
  let starterFlourWeight;
  let starterWaterWeight;
  let yeastWater = 0;
  let starterYeastWeight;

  if (recipe.starterLevain) {
    starterFlourWeight = (yeastWeight * 100) / recipe.starterLevain;
    starterWaterWeight = starterFlourWeight * (recipe.starterHydration / 100.0);
    starterWeight = starterFlourWeight + starterWaterWeight + yeastWeight;
    rows.push({
      title: `Levain (${1 + nightsAging} nights ahead)`,
      subtitle:
        "Dissolve levain in water, add flour, and mix to combine. Then cover and leave at room temperate overnight to mix dough the following evening.",
      rows: [
        {
          item: "Levain culture",
          weightG: asGrams(starterFlourWeight * (recipe.starterLevain / 100.0)),
          bakersPercent: asBakersPercent(recipe.starterLevain),
        },
        {
          item: "Water at 90°",
          weightG: asGrams(starterWaterWeight),
          bakersPercent: asBakersPercent(recipe.starterHydration),
        },
        {
          item: "Flour",
          weightG: asGrams(starterFlourWeight),
          bakersPercent: asBakersPercent(100),
        },
      ],
    });
  }

  if (recipe.starter) {
    starterWeight = flourWeight * (recipe.starter / 100.0);
    starterFlourWeight =
      (starterWeight * 100) / (100 + recipe.starterHydration);
    starterWaterWeight = starterFlourWeight * (recipe.starterHydration / 100.0);
    starterYeastWeight =
      starterFlourWeight *
      ((STARTER_YEAST_MULTIPLIER *
        getYeastBP(yeastType, nightsAging, starter)) /
        100.0);
    const starterRow = {
      title: `${starter} (${1 + nightsAging} nights ahead)`,
      subtitle:
        "Dissolve yeast in water, add flour, and mix to combine. Then cover and leave at room temperate overnight to mix dough the following evening.",
      rows: [
        {
          item: yeastType,
          weightG: asGrams(starterYeastWeight, 2),
          bakersPercent: asBakersPercent(
            (starterYeastWeight / starterFlourWeight) * 100
          ),
        },
        {
          item: "Water at 90°",
          weightG: asGrams(starterWaterWeight),
          bakersPercent: asBakersPercent(recipe.starterHydration),
        },
        {
          item: "Flour",
          weightG: asGrams(starterFlourWeight),
          bakersPercent: asBakersPercent(100),
        },
      ],
    };

    rows.push(starterRow);
  }

  if (starter !== Starter.Levain && yeastType === Yeast.Active) {
    yeastWater = waterWeight / 3;
    const yeastRow = {
      title: `Yeast (${
        nightsAging ? `${nightsAging} nights` : "8 hours"
      } ahead)`,
      subtitle: "Dissolve yeast in water to activate prior to adding to dough.",
      rows: [
        {
          item: "Water at 85°",
          weightG: asGrams(yeastWater, 2),
          bakersPercent: asBakersPercent((100 * yeastWater) / flourWeight),
        },
        {
          item: "Active Dry Yeast",
          weightG: asGrams(yeastWeight - starterYeastWeight),
          bakersPercent: asBakersPercent(
            ((yeastWeight - starterYeastWeight) / flourWeight) * 100
          ),
        },
      ],
    };

    rows.push(yeastRow);
  }

  const finalRow = {
    title: `Dough (${nightsAging ? `${nightsAging} nights` : "8 hours"} ahead)`,
    subtitle:
      nightsAging > 0
        ? `After mixing, bulk ferment for 20 minutes, then ball at ${asGrams(
            ballWeight
          )} and refrigerate for ${nightsAging} night(s). Remove from fridge at least 1 hour before shaping (i.e. while preheating the oven!).`
        : `After mixing, bulk ferment for 2 hours, then ball at ${asGrams(
            ballWeight
          )} and leave at room temperature for 6-8 hours for secondary fermentation.`,
    rows: [
      {
        item: yeastWater ? "Water, Chilled" : "Water at 90°",
        weightG: asGrams(waterWeight - yeastWater - starterWaterWeight),
        bakersPercent: asBakersPercent(
          (100 * (waterWeight - yeastWater)) / flourWeight
        ),
      },
      {
        item: "Fine sea salt",
        weightG: asGrams(flourWeight * (SALT_BP / 100.0)),
        bakersPercent: asBakersPercent(SALT_BP),
      },
    ],
  };

  if (yeastWater) {
    finalRow.rows.push({
      item: "Yeast water",
      weightG: asGrams(yeastWater + yeastWeight - starterYeastWeight),
      bakersPercent: asBakersPercent(
        (100 * (yeastWater + yeastWeight - starterYeastWeight)) / flourWeight
      ),
    });
  }

  if (recipe.starter || recipe.starterLevain) {
    finalRow.rows.push({
      item: starter,
      weightG: asGrams(starterWeight),
      bakersPercent: asBakersPercent((100 * starterWeight) / flourWeight),
    });
  }

  finalRow.rows.push({
    item: "Flour",
    weightG: asGrams(flourWeight - starterFlourWeight),
    bakersPercent: asBakersPercent(100),
  });

  rows.push(finalRow);

  const firstRow = {
    title: `For ${pieCount} balls at ${asGrams(ballWeight)} each:`,
    subtitle: "Individual steps described below.",
    rows: compact([
      {
        item: "Flour",
        weightG: asGrams(flourWeight),
        bakersPercent: asBakersPercent(100),
      },
      {
        item: "Water",
        weightG: asGrams(waterWeight),
        bakersPercent: asBakersPercent((waterWeight / flourWeight) * 100),
      },
      starter === Starter.Levain && {
        item: "Levain culture",
        weightG: asGrams(yeastWeight),
        bakersPercent: asBakersPercent((yeastWeight / flourWeight) * 100),
      },
      {
        item: "Salt",
        weightG: asGrams(saltWeight),
        bakersPercent: asBakersPercent((saltWeight / flourWeight) * 100),
      },
      starter !== Starter.Levain &&
        yeastWeight && {
          item: "Yeast",
          weightG: asGrams(yeastWeight),
          bakersPercent: asBakersPercent((yeastWeight / flourWeight) * 100),
        },
      oilWeight && {
        item: "Oil",
        weightG: asGrams(oilWeight),
        bakersPercent: asBakersPercent((oilWeight / flourWeight) * 100),
      },
    ]),
  };

  rows.splice(0, 0, firstRow);

  return rows;
}
