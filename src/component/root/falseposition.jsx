import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate,max,min } from 'mathjs';
import Plot from 'react-plotly.js'


const falseposition=()=> {
    const [data, setData] = useState([]);
    const [funcXY, setfuncXY] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^2)-13")
    const [X,setX] = useState(0)
    const [XL,setXL] = useState(0)
    const [XR,setXR] = useState(0)

    const print = () =>{
        data.shift();
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
                                <td>{element.Xm}</td>
                                <td>{element.y.toPrecision(6)}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
           
        );
    }

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
    const Calfalseposition = (xl, xr ,err) => {
        console.log("work!!")
        let xm, fXm, fXr, fXl, ea;
        let iter = 0;
        const MAX = 1000;
        const e = 0.00001;
        const newData = []; 

        do{
            fXr = evaluate(Equation, { x: xr });
            fXl = evaluate(Equation, { x: xl });

            xm = (xl * fXr - xr * fXl)/(fXr-fXl);
            fXm = evaluate(Equation, { x: xm });

            if(fXm * fXr>0){
                ea = error(xr, xm);
                newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, y:fXm });
                xr = xm;
            }
            else{
                ea = error(xl, xm);
                newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, y:fXm });
                xl = xm;
            }
            iter++;
            console.log(newData)
        }while(ea > e && iter < MAX);
        
        setData(newData);
        setX(xm);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputXL = (event) =>{
        setXL(event.target.value)
    }

    const inputXR = (event) =>{
        setXR(event.target.value)
    }
    const calculateRoot = () =>{
        const xlnum = parseFloat(XL)
        const xrnum = parseFloat(XR)
        Calfalseposition(xlnum,xrnum);

        initialFunc();
        
        setHtml(print());   
    }
    const initialFunc = () => {
        let Max = max(data.map((item)=>item.Xm));
        let Min = min(data.map((item)=>item.Xm));
        for (let i = Min-2; i <= Max+2; i += 0.01) {
            data.push({ x: i, y: evaluate(Equation, { x: i }) });
        }
        
        setfuncXY(data); 
    };
    const plotData = {
        x: data.map(item => item.Xm),
        y: data.map(item => item.y),
        type: 'scatter',
        mode: 'markers',
        name: 'Xl',
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
                            <Form.Label>Input XL</Form.Label>
                            <input type="number" id="XL" onChange={inputXL} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XR</Form.Label>
                            <input type="number" id="XR" onChange={inputXR} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
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
                data={[plotData,plotFx]}
                layout={{ title: 'False-position Methods',dragmode: 'pan'}}
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
export default falseposition;