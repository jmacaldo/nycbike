import axios from 'axios';

//submit a plate to the DB
export const submitPlate = (plate, state) => {
  return dispatch => {
      axios.post(`/api/plates/submit`, {plate: plate, state: state})
      .then( res => {
        // console.log(res.data);
      })
  }
}
