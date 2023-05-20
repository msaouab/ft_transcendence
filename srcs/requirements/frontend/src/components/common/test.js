const Loop = function(func) {
    (function loop(time) {
       func(Math.min((Date.now() - time) / 10, 1));
       window.requestAnimationFrame(loop.bind(Date.now()));
    })(Date.now());
 };
 
 const gameStartHeight = R.subtract(R.divide(window.innerHeight, 2), 150);
 const paddleLimit = window.innerHeight - 150;
 
 class Instructions extends React.Component {
    static propTypes = {
       clickHandler: PropTypes.func.isRequired,
       showInstructions: PropTypes.bool.isRequired
    }
 
 render() {
       const clx = this.props.showInstructions ? 'instr': 'instr-hide';
    return (
             <div className={`${clx}`}>
                <h3 style={{ textAlign: "center", marginBottom: 50 }}>Use ↑ and ↓ arrows to move the paddle.</h3>
              <button onClick={this.props.clickHandler} className='btn'>got it</button>
             </div>
    )
 }
 } 
 class Header extends React.Component {
    static propTypes = {
       clickHandler: PropTypes.func.isRequired,
       showButton: PropTypes.bool.isRequired
    };
    renderPlayButton = () => {
       const clx = this.props.showButton ? '' : '-hide';
       return (<button className={`btn${clx}`} disabled={!this.props.showButton} onClick={this.props.clickHandler}>
                   Play Game
                </button>)}
    render() {
       return (
          <div className="Header">
             <div className="menu">
                <h1>Welcome to Pong</h1>
                <div className="btnWrapper">
                   {this.renderPlayButton()}
                </div>
             </div>
          </div>
       );
    }
 }
 
 class Score extends React.Component {
    static propTypes = {
       total: PropTypes.number,
       position: PropTypes.oneOf(["left", "right"]).isRequired,
       player: PropTypes.string.isRequired
    };
 
    static defaultProps = {
       total: 0
    };
 
    render() {
       return (
          <div className={this.props.position}>
             <h2>Player {this.props.player}</h2>
             <h2>{this.props.total}</h2>
          </div>
       );
    }
 }
 
 class PongBall extends React.Component {
    static propTypes = {
       x: PropTypes.number.isRequired,
       y: PropTypes.number.isRequired
    };
 
    render() {
       return (
          <div
             style={{
                width: "30px",
                height: "30px",
                top: `${this.props.y}px`,
                left: `${this.props.x}px`,
                position: "absolute",
                backgroundColor: "white"
             }}
             className="PongBall"
          />
       );
    }
 }
 
 class Paddle extends React.Component {
    static propTypes = {
       x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
       y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
       onKeyDown: PropTypes.func,
       tabIndex: PropTypes.string
    };
 
    static defaultProps = {
       onKeyDown: Function.prototype,
       tabIndex: ""
    };
 
    render() {
       return (
          <div
             role="button"
             onKeyDown={this.props.onKeyDown}
             className="Paddle"
             tabIndex={this.props.tabIndex}
             style={{
                width: "15px",
                height: "150px",
                position: "absolute",
                backgroundColor: "#ffffff",
                opacity: "0.7",
                top: `${this.props.y}px`,
                left: `${this.props.x}px`
             }}
          >
             <input type="text" className="paddleInput" />
          </div>
       );
    }
 }
 
 class Game extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          ballY: Math.floor(window.innerHeight / 2),
          ballX: Math.floor(window.innerWidth / 2),
          // randomly choose the direction
          vx: 5 * (Math.random() < 0.5 ? 1 : -1), // accelleration
          vy: 5 * (Math.random() < 0.5 ? 1 : -1), // accelleration
          speed: 2 * (Math.random() < 0.5 ? 1 : -1),
 
          leftScore: 0,
          rightScore: 0,
 
          leftPaddleTop: gameStartHeight,
          rightPaddleY: 150,
          hasGameStarted: false,
          showInstructions: true
       };
    }
 
    onKeyDown = event => {
       // if up arrow hit & top of paddle is below top header
       if (
          event.keyCode === 38 &&
          event.target.getBoundingClientRect().top > 0
       ) {
          this.setState(prevState => ({
             leftPaddleTop: prevState.leftPaddleTop - 10
          }));
       } else if (
          event.keyCode === 40 &&
          R.add(event.target.getBoundingClientRect().top, 150) <
             window.innerHeight
       ) {
          // if down arrow is hit and at the bottom of the window
          this.setState(prevState => ({
             leftPaddleTop: prevState.leftPaddleTop + 10
          }));
       }
    };
 
    focusPaddle = () => {
       ReactDOM.findDOMNode(this.refs.p1).focus();
    };
 
    startButtonHandler = e => {
       this.setState({
          ballX: window.innerWidth / 2,
          ballY: window.innerHeight / 2,
          leftScore: 0,
          rightScore: 0,
          hasGameStarted: true
       });
       e.target.blur();
 
       this.focusPaddle();
       this.startGame();
    };
 
    startGame = () => {
       Loop(tick => {
          tick === 0 ? (tick = 1) : tick;
          
             this.easyAI(tick);
          
          
          this.setState({
             ballX: R.add(this.state.ballX, this.state.vx),
             ballY: R.add(this.state.ballY, this.state.vy)
          });
 
          // // if the ball is at the right side of the screen
          if (this.state.vx > 0 && this.state.ballX > R.add(this.boardBoundsRight, 50)) {
             if (this.state.leftScore !== 11) {
                this.setState({
                   vx: R.negate(this.state.vx),
                   leftScore: R.inc(this.state.leftScore)
                }); // reverse direction of ball
             } else {
                this.setState({
                   vx: R.negate(this.state.vx)
                });
             }
          }
 
          if (
             this.state.ballX > R.subtract(this.boardBoundsRight, 50) &&
             this.state.ballY > this.state.rightPaddleY &&
             this.state.ballY < R.add(this.state.rightPaddleY, 150)
          ) {
             return this.setState({
                vx: R.negate(this.state.vx)
             });
          }
 
          // if ball is on the left side past paddle
          if (this.state.vx < 0 && this.state.ballX < -50) {
             if (this.state.rightScore !== 11) {
                this.setState({
                   rightScore: R.inc(this.state.rightScore),
                   vx: R.negate(this.state.vx)
                }); // reverse direction of ball
             } else {
                this.setState({ vx: R.negate(this.state.vx) });
             }
          } else if (
             this.state.vx < 0 &&
             this.state.ballX <= 20 &&
             this.state.ballY > this.state.leftPaddleTop &&
             this.state.ballY < R.add(this.state.rightPaddleY, 150)
          ) {
             // Hit left paddle!!
             return this.setState({
                vx: R.negate(this.state.vx)
             });
          }
 
          // if the ball is at the bottom or top of the board
          if (this.state.ballY > window.innerHeight - 15) {
             this.setState({ vy: R.negate(this.state.vy) });
          } else if (this.state.ballY < 0) {
             this.setState({ vy: R.negate(this.state.vy) });
          }
       });
    };
 
    easyAI = tick => {
       if (this.state.rightPaddleY >= 0) {
          this.setState(prevState => ({
             rightPaddleY: R.multiply(
                R.add(prevState.rightPaddleY, this.state.speed),
                tick
             )
          }));
       }
 
       if (this.state.rightPaddleY < 0) {
          this.setState(prevState => ({
             speed: R.negate(prevState.speed),
             rightPaddleY: R.multiply(
                R.add(prevState.rightPaddleY, R.negate(this.state.speed)),
                tick
             )
          }));
       }
       if (this.state.rightPaddleY > R.subtract(window.innerHeight, 120)) {
          this.setState(prevState => ({
             speed: R.negate(prevState.speed),
             rightPaddleY: R.multiply(
                R.add(prevState.rightPaddleY, R.negate(this.state.speed)),
                tick
             )
          }));
       }
    };
 
    boardBoundsRight = window.innerWidth + 10;
 
    renderGameOverText = () => {
       const {
          leftScore,
          rightScore
       } = this.state;
       const winner = leftScore === 11 ? "Player 1" : "Player 2";
       return leftScore === 11 ||
          (rightScore === 11 && (
             <div className="gameOver">
                <h1 style={{ display: "flex" }}>{`game over ${winner} wins`}</h1>
                <h3>Refresh page to play again</h3>
             </div>
          ));
    };
 
    closeInstructions = () => {console.log('in click handler')
                               return this.setState({showInstructions: !this.state.showInstructions})}
    
    render() {
       const {
          ballX,
          ballY,
          leftPaddleTop,
          leftScore,
          level,
          rightScore,
          hasGameStarted,
          showInstructions
       } = this.state;
       const isGameOver =  leftScore === 11|| rightScore === 11
       return (
          <div className="Game">
             <Header
                level={level}
                clickHandler={this.startButtonHandler}
                showButton={isGameOver || !hasGameStarted}
             />
             <Score position="left" player="1" total={leftScore} />
             {this.renderGameOverText()}
             <Instructions clickHandler={this.closeInstructions} showInstructions={showInstructions}/>
             <Score position="right" player="2" total={rightScore} />
             <Paddle
                name="p1"
                id="p1"
                x={5}
                tabIndex="0"
                ref="p1"
                y={leftPaddleTop}
                onKeyDown={this.onKeyDown}
                position="left"
                focused={this.state.focused}
             />
             <div className="vl" />
             <PongBall x={ballX} y={ballY} />
             <Paddle
                x={R.subtract(this.boardBoundsRight, 30)}
                y={this.state.rightPaddleY}
                position="right"
             />
          </div>
       );
    }
 }
 
 class App extends React.Component {
    render() {
       return (
          <div className="App">
             <Game />
          </div>
       );
    }
 }
 
 ReactDOM.render(<App />, document.getElementById("root"));
 