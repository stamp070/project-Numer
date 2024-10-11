import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate,floor,log10,abs } from 'mathjs';
import Plot from "react-plotly.js"


const graphical=()=> {
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^2)-13")
    const [X,setX] = useState(0)
    const [XStart,setXStart] = useState(0)
    const [XEnd,setXEnd] = useState(0)

    const print = () =>{
        return(
            <Container className='mr-5'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">X</th>
                            <th width="30%">Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.x.toPrecision(7)}</td>
                                <td>{element.y.toPrecision(7)}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
           
        );
    }
    const checkDigitPlace =(num)=>{
        if (num === 0) return 1; 
        const digitPlace = floor(log10(abs(num))); 

        return Math.pow(10, digitPlace);
    }

    const Calgraphical = (xStart, xEnd ,err) => {
        let fx,mid;
        let iter = 0;
        let step = checkDigitPlace(xStart-xEnd);
        const MAX = 100;
        const e = 0.000001;
        const newData = []; 

        let x = xStart,y=xEnd;
        do{
            iter++;
            console.log("step: "+step);
            console.log("x: "+x+" y:"+y)
            for(let i=x;i<y;i+=step){

                fx = evaluate(Equation,{ x:i });
                let next = evaluate(Equation,{ x:i+step })
                console.log(fx +"  "+ next)

                if(fx * evaluate(Equation,{x:i+step})<0){
                    console.log("----")
                    x = i;
                    y = i+step;
                    break;
                }
            }
            mid = (x+y)/2;
            step/=10;

            newData.push({ iteration: iter, x:mid, y: evaluate(Equation, { x: mid }) });
        }while(e < step && iter < MAX)
        
        setData(newData);
        setX(mid);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputXStart = (event) =>{
        setXStart(event.target.value)
    }

    const inputXEnd = (event) =>{
        setXEnd(event.target.value)
    }
    
    const calculateRoot = () =>{
        const xstart = parseFloat(XStart)
        const xend = parseFloat(XEnd)
        Calgraphical(xstart,xend);
        
        setHtml(print());   
    }

    const plotData = {
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Xl',
        marker : {'color' : 'red'},
        line : {'color' : '#7695FF'}
    };

    return(
        <Container>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label>Input f(x)</Form.Label>
                            <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XStart</Form.Label>
                            <input type="number" id="XL" onChange={inputXStart} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XEnd</Form.Label>
                            <input type="number" id="XR" onChange={inputXEnd} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                        </Form.Group>
                    <Button variant="dark" onClick={calculateRoot}>
                        Calculate
                    </Button>
                </Form>
                <br></br>
                <h5>Answer = {X.toPrecision(7)}</h5>
                <Container>
            </Container>
            <Plot
                data={[plotData]}
                layout={{ title: 'Graphical Methods',dragmode: 'pan'}}
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
export default graphical;