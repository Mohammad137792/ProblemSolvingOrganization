import { NOTE, SET_EXAMINER } from "./../../actions/fadak/hse.actions";

const hseDoq = (
  state = { examiners: [], examinationProcess: {}, examiner: {} },
  action
) => {
  switch (action.type) {
    case NOTE:
      return action.payload;
    case SET_EXAMINER:
      return action.payload;
    default:
      return state;
  }
};
export default hseDoq;
