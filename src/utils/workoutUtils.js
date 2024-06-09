import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./swoldier";
const exercises = exercisesFlattener(EXERCISES);

export function createWorkoutPlan(args) {
  const { muscles, poison: workout, goal } = args;

  // Filter out exercises that cannot be done at home
  let exerciseKeys = Object.keys(exercises).filter(
    (key) => exercises[key].meta.environment !== "home"
  );

  let includedExercises = [];
  let listOfMuscles;

  // Determine the list of muscles to target
  if (workout === "individual") {
    listOfMuscles = muscles;
  } else {
    listOfMuscles = WORKOUTS[workout][muscles[0]];
  }

  // Shuffle and convert to array
  listOfMuscles = Array.from(new Set(shuffleArray(listOfMuscles)));

  // Determine the scheme and sets
  let scheme = goal;
  let sets = SCHEMES[scheme].ratio
    .reduce((acc, curr, index) => {
      let setType = index === 0 ? "compound" : "accessory";
      return [
        ...acc,
        ...Array.from({ length: parseInt(curr) }).map(() => setType),
      ];
    }, [])
    .reduce((acc, curr, index) => {
      const muscleGroup =
        index < listOfMuscles.length
          ? listOfMuscles[index]
          : listOfMuscles[index % listOfMuscles.length];
      return [...acc, { setType: curr, muscleGroup }];
    }, []);

  // Split exercises into compound and accessory
  const { compound: compoundExercises, accessory: accessoryExercises } =
    exerciseKeys.reduce(
      (acc, key) => {
        const exercise = exercises[key];
        const hasRequiredMuscle = exercise.muscles.some((musc) =>
          listOfMuscles.includes(musc)
        );
        if (hasRequiredMuscle) {
          acc[exercise.type][key] = exercise;
        }
        return acc;
      },
      { compound: {}, accessory: {} }
    );

  // Generate workout
  const workoutPlan = sets.map(({ setType, muscleGroup }) => {
    const data =
      setType === "compound" ? compoundExercises : accessoryExercises;
    const availableExercises = Object.keys(data).filter(
      (key) =>
        !includedExercises.includes(key) &&
        data[key].muscles.includes(muscleGroup)
    );

    const fallbackExercises = Object.keys(
      setType === "compound" ? accessoryExercises : compoundExercises
    ).filter((key) => !includedExercises.includes(key));

    const randomExercise = availableExercises.length
      ? availableExercises[
          Math.floor(Math.random() * availableExercises.length)
        ]
      : fallbackExercises[Math.floor(Math.random() * fallbackExercises.length)];

    if (!randomExercise) return {};

    let repsOrDuration =
      data[randomExercise].unit === "reps"
        ? getRandomReps(SCHEMES[scheme].repRanges, setType)
        : getRandomDuration();

    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    if (data[randomExercise].unit === "reps") {
      repsOrDuration = adjustRepsForTempo(repsOrDuration, tempo);
    } else {
      repsOrDuration = adjustDuration(repsOrDuration);
    }

    includedExercises.push(randomExercise);

    return {
      name: randomExercise,
      tempo,
      rest: SCHEMES[scheme].rest[setType === "compound" ? 0 : 1],
      reps: repsOrDuration,
      ...data[randomExercise],
    };
  });

  return workoutPlan.filter((exercise) => Object.keys(exercise).length > 0);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function exercisesFlattener(exercisesObj) {
  const flattened = {};
  for (const [key, val] of Object.entries(exercisesObj)) {
    if (!val.variants) {
      flattened[key] = val;
    } else {
      for (const variant in val.variants) {
        const variantName = `${variant}_${key}`;
        const variantSubstitutes = Object.keys(val.variants)
          .map((v) => `${v} ${key}`)
          .filter((v) => v.replace(" ", "_") !== variantName);
        flattened[variantName] = {
          ...val,
          description: `${val.description}___${val.variants[variant]}`,
          substitutes: [...val.substitutes, ...variantSubstitutes].slice(0, 5),
        };
      }
    }
  }
  return flattened;
}

function getRandomReps(repRanges, setType) {
  const minReps = Math.min(...repRanges);
  const maxReps = Math.max(...repRanges);
  const baseReps =
    Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;
  return setType === "accessory" ? baseReps + 4 : baseReps;
}

function getRandomDuration() {
  return Math.floor(Math.random() * 40) + 20;
}

function adjustRepsForTempo(reps, tempo) {
  const tempoSum = tempo.split(" ").reduce((acc, t) => acc + parseInt(t), 0);
  if (tempoSum * reps > 85) {
    return Math.floor(85 / tempoSum);
  }
  return reps;
}

function adjustDuration(duration) {
  return Math.ceil(duration / 5) * 5;
}
