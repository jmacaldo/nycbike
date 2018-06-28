import React, { Component } from 'react';
import axios from 'axios'
import { Image, Popover, OverlayTrigger, Table } from 'react-bootstrap'
import './style.css'
// HDZ2593



class Share extends Component {
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
     this.setState({query: this.props.match.params.plate})
     this.setState({queryState: this.props.match.params.state})
     axios.get('https://data.cityofnewyork.us/resource/uvbq-3m68.json', {
       params: {
         $limit: 5000,
         $$app_token: '82HqD0isylvN2iMSeu6YMUOUU',
         plate: this.props.match.params.plate,
         state: this.props.match.params.state,
         $order: ':id DESC',
       }
     })
     .then(response => this.setState({data:response}))
     .catch(function (error) {
       console.log(error);
     })
     this.props.actions.submitPlate(this.props.match.params.plate, this.props.match.params.state)

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
        $$app_token: '82HqD0isylvN2iMSeu6YMUOUU',
        plate: this.state.input,
        state: this.state.state,
        $order: ':id DESC',
      }
    })
    .then(response => this.setState({data:response}))
    .catch(function (error) {
      console.log(error);
    })
    // this.props.actions.submitPlate(this.state.input, this.state.state)
    }
  }

  copyLink(){
    let copyText = document.getElementById("share");
    copyText.select();
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


    const pop = (
  <Popover id="popover-positioned-left">
     <div><strong>Hi there!</strong> I hope you've enjoyed this nifty app, that I've made. I am currently looking for work as a web developer. Feel free to peruse my  <a target="_blank" rel="noopener noreferrer" href="https://jmacaldo.github.io/">portfolio</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/jmacaldo">Github</a> pages.</div><br></br>

     <div><Image style={styles.avatar} circle src="https://s3.amazonaws.com/vcbc/avatars/me.jpg"/> - Joven</div>
  </Popover>
);

// rendered content starts here
    return (
      <div>
        <div style={styles.center}>
          <hr style={styles.line} />
          <div style={styles.headline} className="headline">
            <a href="/">NYC Traffic<br></br>Ticket Search</a>
          </div>
          <div style={styles.sub} >
            Search over 25 million NYC public traffic records. Updated daily.
          </div>
            {dataTable()}
          </div>

          <div className="footer">
            <small>Coded in Brooklyn with ♥ by <OverlayTrigger trigger="click" placement="top" overlay={pop} rootClose><a>Joven Macaldo</a></OverlayTrigger></small>
          </div>
          </div>
    );
  }
}



const styles  = {
  center: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 40
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
  results: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: '10px',
    paddingTop: 20,
    maxWidth: 630,
    minWidth: 350,
    marginBottom: 100
  },
  headline: {
    color: 'white',
    fontSize: 60,
    fontWeight: 700,
    lineHeight: '90%'
  },
  footer: {
    marginTop: 30
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
  }

}





export default Share;
