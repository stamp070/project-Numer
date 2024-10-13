import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate,max,min } from 'mathjs';
import Plot from 'react-plotly.js'


const onepoint=()=> {
    const [data, setData] = useState([]);
    const [datagraph, setdatagraph] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("cos(x)");
    const [X,setX] = useState(0);
    const [Xans,setXans] = useState(0);

    const [funcXY,setfuncXY] = useState([]);

    const print =()=>{
        return(
            <Container className='mr-5'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.y.toPrecision(6)}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
        );
    }

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
    const Calonepoint = (x ,err) => {
        console.log(data)
        let xold=x*100, ea;
        let iter = 0;
        const MAX = 100;
        const e = 0.00001;
        const newData = [];
        const graphData = [];
        
        do{
            iter++;
            
            newData.push({ iteration: iter, x: x,y: evaluate(Equation, { x: x })});
            
            let obj ={
                x: x,
                y: x
            }

            graphData.push({x: x,y: evaluate(Equation, { x: x })})
            graphData.push(obj)

            x = evaluate(Equation, { x : x });
            ea = error(x, xold);

            xold = x;
            
        }while(ea > e && iter < MAX);

        console.log(graphData)

        setData(newData);
        setdatagraph(graphData)
        setXans(x);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputX = (event) =>{
        setX(event.target.value)
    }

    const calculateRoot = () =>{
        const x = parseFloat(X)
        Calonepoint(x);

        initialFunc();
        
        setHtml(print());   
    }

    const initialFunc = () => {
        let data = [];

        let Max = max(datagraph.map((item)=>item.x));
        let Min = min(datagraph.map((item)=>item.x));
        let x = Number(X);

        for (let i = Min-x; i <= Max+x; i += 0.01) {
            data.push({ x: i, y: evaluate(Equation, { x: i }) });
        }
        console.log(Max,X)
        setfuncXY(data); 
    };

    const plotOnePoint = {
        x: datagraph.map(item => item.x),
        y: datagraph.map(item => item.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'One-Point',
        marker : {'color' : 'red'},
        line : {'color' : '#7695FF'}
    };

    const plotFx = {
        x: funcXY.map(item => item.x),
        y: funcXY.map(item => item.y),
        type: 'scatter',
        name: 'f(x)',
        mode: 'line',
        line : {'color' : '#72BF78'}
    }

    return(
        <Container>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label>Input f(x)</Form.Label>
                            <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Initial x</Form.Label>
                            <input type="number" id="X" onChange={inputX} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            
                        </Form.Group>
                    <Button variant="dark" onClick={calculateRoot}>
                        Calculate
                    </Button>
                </Form>
                <br></br>
                <h5>Answer = {Xans.toPrecision(7)}</h5>
                <Container>
            </Container>
            <Plot
                data={[plotOnePoint,plotFx]}
                layout={{ title: 'One-point Iteration Methods',dragmode: 'pan'}}
                style={{ width: "100%", height: "400px" }}
                config={{scrollZoom: true}}
                useResizeHandler={true}
            />
            <div class="flex justify-center">
                {html}
            </div>
            </Container>
    );
};
export default onepoint;