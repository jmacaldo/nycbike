import React, { Component } from 'react';
import axios from 'axios'
import { Glyphicon, Image, Modal, Popover, OverlayTrigger, ButtonToolbar, Form, FormControl, Table, FormGroup, Button, Jumbotron } from 'react-bootstrap'
import './style.css'

class App extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.textChange = this.textChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
    this.enterKey = this.enterKey.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.copyLink = this.copyLink.bind(this);

    this.state = {
      data: [],
      input: '',
      query: '',
      fines: '',
      error: false,
      state: 'NY',
      queryState: 'NY',
      nores: false,
      show: false,
      copy: false
    };
  }

  enterKey(e){
   if(e.keyCode === 13) {
     e.preventDefault()
     this.submit(e)
     }
   }

   handleClose() {
   this.setState({ show: false });
   this.setState({ copy: false });
 }

 handleShow() {
   this.setState({ show: true });
 }

   getValidationState() {
    const length = this.state.input.length;
    if (length > 2) return 'success';
    else if (length > 1) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }


  componentWillMount(){
     document.body.style.backgroundColor = 'rgba(25,158,218,1)';
     console.log('What\'re you doing back here?!? ಠ_ಠ');
  }

  componentDidMount(){
    document.addEventListener("keydown", this.enterKey, false);
  }

  componentWillUnmount(){
  document.addEventListener("keydown", this.enterKey, false);
 }

  submit(e){
    if (this.state.input.length < 1){
      this.setState({error: true})
    } else {
    this.setState({query: this.state.input})
    this.setState({queryState: this.state.state})
    axios.get('https://data.cityofnewyork.us/resource/uvbq-3m68.json', {
      params: {
        $limit: 5000,
        $$app_token: /*INSERT APP TOKEN HERE*/,
        plate: this.state.input,
        state: this.state.state,
        $order: ':id DESC',
        $order: 'summons_number DESC',

      }
    })
    .then(response => this.setState({data:response}))
    .catch(function (error) {
      console.log(error);
    })
    this.props.actions.submitPlate(this.state.input, this.state.state)
    }
  }

  copyLink(range){
    let copyText = document.getElementById("share");
    copyText.focus()
    copyText.setSelectionRange(0, 100);
    document.execCommand("Copy");
    this.setState({copy: true})
  }

  reset(){
      this.setState({query: ''})
      this.setState({input: ''})
      this.setState({error: false})
      this.setState({state: 'NY'})
      this.setState({data: []})
  }

//this function forces all caps for plate input and trims any whitespace
  textChange(e){
    let uppercase = (e.target.value).toUpperCase().replace(/\s/g, "")
    this.setState({input: uppercase})
  }

  stateChange(e){
    let state = e.target.value
    this.setState({state: e.target.value})
  }



  render() {

    const totalFines = () =>{
      if (this.state.data.data) {
        let arr = [0]
         this.state.data.data.map((item) => (
            arr.push(parseInt(item.fine_amount, 10))
         ))

        function cleanArray(arr) {
          var newArray = new Array();
          for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
              newArray.push(arr[i]);
            }
          }
          newArray.push(0)
          return newArray;
        }

        const add = (a, b) => a + b

        let total = cleanArray(arr).reduce(add)

        const numberWithCommas = (x) => {
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }


        let fines = numberWithCommas(total)
        return fines
      }
    }

    const summary = () => {
      if (this.state.data.data.length ===1) {
        return <h5 style={styles.summary}>{this.state.query} ({this.state.queryState}) has one violation totaling  ${totalFines()} in fines</h5>
      } else {
        return <h5 style={styles.summary}>{this.state.query} ({this.state.queryState}) has {this.state.data.data.length} violations totaling  ${totalFines()} in fines</h5>
      }
    }

    const dataTable = () => {
      if (this.state.data.data <= 0) {
        return <h5 style={styles.nores}>There are no results for {this.state.query} ({this.state.queryState})</h5>
      } else if (this.state.data.data)  {
      return <div>
        <div style={styles.results}>
          <div style={styles.shareBtn}>
            <Button bsSize="small" onClick={this.handleShow}>
              <Glyphicon glyph="share-alt" /> Share
            </Button>
          </div>
          <div>{summary()}</div>
            <Table responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Violation</th>
                  <th>Fine Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.data.map((item) => (
                  <tr key={item.summons_number}>
                    <td>{item.issue_date}</td>
                    <td>{item.violation}</td>
                    <td>${item.fine_amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
      </div>
      }
    }

    const placeholder = () =>{
      if (this.state.error) {
        return "Required"
      } else {
      return "Enter license plate"
      }
    }

    const sharelink = () =>{

      return (`https://nycbike.herokuapp.com/share/${this.state.query}/${this.state.state}`)

    }

    const pop = (
  <Popover id="popover-positioned-left">
     <div><strong>Hi there!</strong> I hope you've enjoyed this nifty app, that I've made. I am currently looking for work as a web developer. Feel free to peruse my  <a target="_blank" rel="noopener noreferrer" href="https://jmacaldo.github.io/">portfolio</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/jmacaldo">Github</a> pages.</div><br></br>

     <div><Image style={styles.avatar} circle src="https://s3.amazonaws.com/vcbc/avatars/me.jpg"/> - Joven</div>
  </Popover>
);

// rendered content starts here
    return (
        <div>
          <Jumbotron style={styles.mainJumbo}>
            <div style={styles.left}>
              <hr style={styles.line} />
              <div style={styles.headline} >
                NYC Traffic<br></br>Ticket Search
              </div>
              <div style={styles.sub} >
                Search over 25 million NYC public traffic records. Updated daily. Enter a license plate below.
              </div>
              <Form inline>
  <FormGroup controlId="formInlineName" validationState={this.getValidationState()}>
    <FormControl.Feedback /><FormControl
      type="text"
      placeholder={placeholder()}
      onChange={this.textChange}
      value={this.state.input}
      style={styles.form} />
  </FormGroup>{' '}
  <FormGroup controlId="formInlineEmail" >
    <FormControl componentClass="select" placeholder="select" onChange={this.stateChange}   style={styles.statesDrop} value={this.state.state}>
        <option value="NY">New York</option>
        <option value="NJ">New Jersey</option>
        <option value="CT">Connecticut</option>
        <option value="DP">DIPLOMAT</option>
        <option value="AL">Alabama</option>
        <option value="AR">Arkansas</option>
        <option value="AS">American Samoa</option>
        <option value="AZ">Arizona</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="DC">District of Columbia</option>
        <option value="DE">Delaware</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="GU">Guam</option>
        <option value="HI">Hawaii</option>
        <option value="IA">Iowa</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="MA">Massachusetts</option>
        <option value="MD">Maryland</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MO">Missouri</option>
        <option value="MS">Mississippi</option>
        <option value="MT">Montana</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="NE">Nebraska</option>
        <option value="NH">New Hampshire</option>
        <option value="NM">New Mexico</option>
        <option value="NV">Nevada</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="PR">Puerto Rico</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VA">Virginia</option>
        <option value="VI">Virgin Islands</option>
        <option value="VT">Vermont</option>
        <option value="WA">Washington</option>
        <option value="WI">Wisconsin</option>
        <option value="WV">West Virginia</option>
        <option value="WY">Wyoming</option>
      </FormControl>
  </FormGroup>{' '}
</Form>

              <Form inline>


              <ButtonToolbar style={styles.btns}>
                <Button style={styles.submitBtn} onClick={this.submit}>Submit</Button>
                <Button style={styles.resetBtn} bsStyle="danger" onClick={this.reset}>Reset</Button>
              </ButtonToolbar>
            </Form>

            </div>

            <div style={styles.right}>
                {dataTable()}

            </div>



          </Jumbotron>

          <Modal show={this.state.show} onHide={this.handleClose}>
         <Modal.Body>
           <h4>Share link</h4>
             <input
              style={styles.linkText}
              type="text"
              value={sharelink()}
              placeholder={sharelink()}
              onChange={this.handleChange}
              contentEditable="true"
              id="share"
            />

         </Modal.Body>
         <Modal.Footer>
           {this.state.copy && <span style={styles.linkCopy}>Link copied to clipboard! </span>}
           <Button onClick={this.copyLink}>Copy Link</Button>
           <Button onClick={this.handleClose} bsStyle="danger">Close</Button>
         </Modal.Footer>
       </Modal>



          <div className="footer">
            <small>Coded in Brooklyn with ♥ by <OverlayTrigger trigger="click" placement="top" overlay={pop} rootClose><a>Joven Macaldo</a></OverlayTrigger></small>
          </div>


          </div>
    );
  }
}



const styles  = {
  well: {
    backgroundColor: '#fff',
    maxWidth: 600,
    margin: 'auto',
    marginTop: 50,
    padding: 10,
    fontWeight: 200,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 100
  },
  container: {
    marginLeft: 15,
    marginRight: 15
  },
  btns: {
    marginTop: 5,
    marginBottom: 30
  },
  form: {
    borderRadius: '5px'
  },
  summary: {
    fontWeight: 700,
    marginLeft: 7,
    color: 'black'
  },
  statesDrop: {
  },
  logo: {
    maxWidth: '50%',
    minWidth: 290,
    paddingTop: 10,
    paddingBottom: 10
  },
  mainJumbo: {
    backgroundColor: 'rgba(25,158,218,1)',
    display: 'flex',
    flexWrap: 'wrap',

  },
  left: {
    paddingLeft: '8%',
    paddingRight: 10,
    maxWidth: 510,
    minWidth: 400,
    marginBottom: 10,
  },
  right: {
    paddingLeft: '8%',
    paddingRight: 50,
    flex: '1 0',
    minWidth: 380,
    paddingTop: 20
  },
  shareTab: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: '10px 10px 0px 0px',
    width: 100,
    paddingTop: 10

  },
  nores: {
    color: 'white',
    fontSize: 30,
    fontWeight: 700,
    lineHeight: '90%'
  },
  linkCopy: {
    color: "rgb(42, 109, 27)"
  },
  avatar: {
    width: 30,
  },
  linkText: {
    width: '100%'
  },
  results: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: '10px',
    paddingTop: 20,
    marginRight: '8%',
    maxWidth: 630,
    minWidth: 350
  },
  headline: {
    color: 'white',
    fontSize: 60,
    fontWeight: 700,
    lineHeight: '90%'
  },
  footer: {
    // position: 'relative',
    // height: 70,
    // padding: 30,
    // marginBottom: 0,
    // color: "white",
    // backgroundColor: 'rgb(41,44,53)',
  },
  line: {
    color: "white",
    height: '4px',
    width: '100%',
    backgroundColor: 'white',
    border: '0 none'
  },
  link: {
    color: 'white',
    textDecoration: 'underline'
  },
  sub: {
    fontSize: 25,
    fontWeight: 500,
    marginBottom: 50,
    color: 'rgba(0,0,0,.8)'
  },
  submitBtn: {
    width: 80
  },
  resetBtn: {
    width: 80,
    // background: 'rgb(201,49,89)',
    // borderColor: 'rgb(201,49,89)',
    // color: 'white',
    // textShadow: '1px 1px rgb(201,49,89)'
  },
  shareBtn: {
    paddingLeft: 8
  }

}





export default App;
