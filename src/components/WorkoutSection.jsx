import PropTypes from "prop-types";
import SectionWrapper from "./SectionWrapper";
import ExerciseCard from "./ExerciseCard";

const WorkoutSection = ({ workout }) => {
  return (
    <SectionWrapper
      id="workout"
      header="welcome to"
      title={["The", "DANGER", "zone"]}
    >
      <div className="flex flex-col gap-4">
        {workout.map((exercise, i) => (
          <ExerciseCard i={i} exercise={exercise} key={i} />
        ))}
      </div>
    </SectionWrapper>
  );
};

WorkoutSection.propTypes = {
  workout: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      muscles: PropTypes.arrayOf(PropTypes.string).isRequired,
      description: PropTypes.string.isRequired,
      reps: PropTypes.number,
      rest: PropTypes.string,
      tempo: PropTypes.string,
      unit: PropTypes.string,
    })
  ).isRequired,
};

export default WorkoutSection;
