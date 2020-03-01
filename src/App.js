import React from 'react';
import { InputGroup, Button, Form, Container, Row, Col, Navbar } from 'react-bootstrap'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ban from './ban.svg';
import colormap from 'colormap';
import axios from 'axios';
import convert from 'color-convert';
import floor from 'floor';
import luminance from 'luminance'
window.axios = axios;

function App () {
    return (
        <div className="App">
            {/*/}
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p onClick={() => console.log("hey")}>
                    Hello there
                </p>
            </header>
            {/*/}
            <UIHome />
        </div>
    );
}

class ColorPicker extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.pos = -1;
    }

    setPos (ii) {
        this.setState({ pos: ii }, () => {
            (this.props.onChange || (() => {}))(this.state);
        });
    }

    button (c1, c2, index, contents = null) {
        return (
            <Button key={index}
                    variant="outline-secondary"
                    active={index === this.state.pos}
                    className="border-0 rounded-0 p-1"
                    style={{ 'box-shadow': 'none' }}
                    size="sm"
                    onClick={() => this.setPos(index)}
                    >
                <div style={{ width: "40px", height: "40px", backgroundImage: `linear-gradient(to right, ${c1}, ${c2})` }}>
                    {contents}
                </div>
            </Button>
        );
    }

    render () {
        var cmap = colormap({ colormap: [
                           { index: 0, rgb: this.props.startColor },
                           { index: 1, rgb: this.props.endColor }
                       ]
                       , nshades: 6
                       });

        cmap = cmap.map((x, i, a) => [a[i], a[i + 1]]).slice(0,-1);

        return (
            <InputGroup className="pb-2 d-flex justify-content-center">
                <span className="border rounded" style={{ overflow: "hidden" }}>
                {
                    this.button("#fff", "#fff", -1,
                        <>
                            <img src={ban} alt="No Color" width="20" height="20"/>
                            <span style={{ color: "black" }}>None</span>
                        </>
                    )
                }
                {
                    cmap.map(([c1, c2], ii) => this.button(c1, c2, ii))
                }
                </span>
            </InputGroup>
        );
    }
}

class MinuteTimer extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.mins = 3;
        this.state.secs = 0;
    }

    updateTime (mins, secs) {
        mins = parseInt(mins)
        secs = parseInt(secs)

        if (secs < 0) {
            mins -= 1;
            secs += 60;
        } else if (secs >= 60) {
            mins += 1;
            secs -= 60;
        }

        if (mins < 0) {
            this.updateTime(0, 0);
        } else {
            this.setState({ mins, secs }, () => {
                (this.props.onChange || (() => {}))(this.state);
            });
        }
    }

    render () {
        return (
            <>
                <InputGroup className="pb-2">
                    <Form.Control type="number" value={this.state.mins} maximum={5}  minimum={0}
                                  className="border-0"
                                  onChange={e => this.updateTime(e.target.value, this.state.secs)}
                                  />
                    <InputGroup.Text className="border-0 rounded-0">mins</InputGroup.Text>
                    <Form.Control type="number" value={this.state.secs} maximum={60} minimum={0}
                                  className="border-0"
                                  style={{ width: "3ch" }}
                                  onChange={e => this.updateTime(this.state.mins, e.target.value)}
                                  />
                    <InputGroup.Text className="border-0 rounded-0">secs</InputGroup.Text>
                </InputGroup>
                <InputGroup className="pb-2 d-flex justify-content-center">
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins + 1, this.state.secs)}
                            >
                        +1m
                    </Button>
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins - 1, this.state.secs)}
                            >
                        -1m
                    </Button>
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins, this.state.secs + 10)}
                            >
                        +10s
                    </Button>
                    <Button variant="outline-primary" size="sm"
                            onClick={() => this.updateTime(this.state.mins, this.state.secs - 10)}
                            >
                        -10s
                    </Button>
                </InputGroup>
            </>
        );
    }
}

class UIHome extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.temp = NaN;
        this.state.time = { secs: 0, mins: 10 }
        this.state.tea = { level: null, color: [255,255,255] }
        this.state.jug = { connected: false }
        this.state.brew = { started: false, timeElapsed: null }
        this.state.notifications = { minTimer: null, minColor: null }
        this.cycleAPI();
        this.cycleNotifications();
        // this.cycleTime(true)
    }

    apiRoot = "http://localhost:8080/api/v1"

    startBrew () {
        axios.post(`${this.apiRoot}/brew`);
    }

    cycleTime (time) {
        if (time === true) {
            this.setState({ brew: { started: true, timeElapsed: 0 } })
        } else {
            this.setState({ brew: { started: true, timeElapsed: this.state.brew.timeElapsed + 0.01 } })
        }
        setTimeout(this.cycleTime.bind(this), 10)
    }

    reloadAPI () {
        return Promise.all(
            [ axios.get(`${this.apiRoot}/brew`).then(x => {
                if (x.status !== 200) return;
                // this.setState({
                //     brew: {
                //         started: x.data,
                //         ...this.state.brew
                //     }
                // })
              })
            , axios.get(`${this.apiRoot}/brew/time`).then(x => {
                if (x.status !== 200) return;
                this.setState({
                    brew: {
                        started: x.data > 0,
                        timeElapsed: x.data,
                        ...this.state.brew
                    }
                })
              })
            , axios.get(`${this.apiRoot}/tea/colour`).then(x => {
                var data = x.data;
                data = [data.red, data.blue, data.green];
                this.setState({
                    tea: { 
                        color: data,
                        colorHex: "#" + convert.rgb.hex(data),
                        ...this.state.tea
                    }
                });
              })
            , axios.get(`${this.apiRoot}/tea/level`).then(x => {
                this.setState({
                    tea: {
                        level: x.data,
                        ...this.state.tea
                    }
                })
              })
            , axios.get(`${this.apiRoot}/jug/connected`).then(x => this.setState({ jug: { connected: x.data } }))
            , axios.get(`${this.apiRoot}/steam/temperature`).then(x => this.setState({ temp: x.data }))
            ]
        );
    }

    checkNotificationConstraints () {
        if (this.state.notifications.timer != null
            && this.state.timeElapsed > this.state.notifications.minTimer) {
            return true;
        }

        if (this.state.notifications.minColor != null
            && luminance(this.state.tea.color) < luminance(this.state.notifications.minColor)) {
            return true;
        }

        return false;
    }

    cycleNotifications () {
        var constraintMet = this.checkNotificationConstraints();
        if (constraintMet) { this.alertUser() }
        setTimeout(this.cycleNotifications.bind(this), 1000)
    }

    cycleAPI () {
        // console.log("Cycling API...");
        this.reloadAPI().then(setTimeout(this.cycleAPI.bind(this), 1000));
    }

    render () {
        return <Container className="ui">
            <Navbar>
                <Navbar.Brand href="#home">
                    <img src={logo} className="d-inline-block align-top" alt="" style={{ paddingRight: 10, height: "30px", }} />
                    IoTea
                </Navbar.Brand>
            </Navbar>
            <Row>
                <Col>
                    <h3>Notify Me When:</h3>
                    <Form>
                        <h5 className="text-left">Timer reaches following time...</h5>
                        <MinuteTimer />
                        <h5 className="text-left">Tea reaches following darkness...</h5>
                        <ColorPicker startColor={[205,133,63]} endColor={[92,64,51]} />
                        <Button variant="primary" size="lg" onSubmit={this.startBrew.bind(this)}>
                            Brew a Cup!
                        </Button>
                    </Form>
                </Col>
                <Col>
                    <h3>Current Brew Stats:</h3>
                    { this.state.brew.started === false ? <h4>No brew currently active.</h4> :
                    <>
                        
                        <h5 className="text-left">Time Elapsed: {Math.floor(this.state.brew.timeElapsed / 60)}:{(Math.floor(this.state.brew.timeElapsed) % 60).toString().padStart(2, "0")}</h5>
                        <h5 className="text-left">Temperature: {floor(this.state.temp, -2)} °C</h5>
                        <div className="d-flex flex-row">
                            <h5 className="text-left mr-2 mb-0">Tea Color:</h5>
                            <div className="rounded flex-grow-1"
                                 style={{ backgroundColor: this.state.tea.colorHex }}>
                            </div>
                        </div>
                    </> }
                </Col>
            </Row>
        </Container>;
    }
}

export default App;
