import React, { useState } from 'react';
import {abs,det, identity, log, multiply} from 'mathjs'
import 'katex/dist/katex.min.css';
import { InlineMath,BlockMath } from 'react-katex';
import Katex from 'katex/dist/katex.js';


const Lu = () => {
  const [solution,setsolution] = useState(null)
  const [matrixSize, setMatrixSize] = useState(3);
  const [matL,setmatL] = useState(Array(matrixSize).fill(null).map(()=>Array(matrixSize).fill(0))) // set 0
  const [matU,setmatU] = useState(Array(matrixSize).fill(null).map(()=>Array(matrixSize).fill(0))) // set 0
  const [x, setx] = useState(Array(matrixSize).fill(0));
  const [y, sety] = useState(Array(matrixSize).fill(0));
  const [matrixB, setMatrixB] = useState(Array(matrixSize).fill(''));
  const [matrixA, setMatrixA] = useState(
    Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(''))
  );

  const calu=()=>{
    let mat = matrixA.map((row) => row.map((item)=>Number(item)));
    console.log(mat)

    // cal LU
    for(let i=0;i<matrixSize;i++){
        for(let k=i;k<matrixSize;k++){
            let sum = 0;
            for(let j=0;j<i;j++){
                sum +=(matL[k][j] * matU[j][i]);
            }
            matL[k][i] = mat[k][i] - sum;
        }
        for(let k = i;k<matrixSize;k++){
            if(i==k){
                matU[i][i] = 1;
            }
            else{
                let sum = 0;
                for(let j = 0;j<i;j++){
                    sum += (matL[i][j] * matU[j][k]);
                }
                matU[i][k] = (mat[i][k] - sum)/matL[i][i];
            }
        }
    }


    // cal Y
    let tempy = Array(matrixSize).fill(0)
    for(let i = 0;i<matrixSize;i++){
        let sum = 0;
        for(let j=0;j<i;j++){
            sum += matL[i][j] * tempy[j];
        }
        tempy[i] = (matrixB[i] - sum)/matL[i][i];
    }
    
    //cal X
    let tempx = Array(matrixSize).fill(0)
    for(let i = matrixSize-1;i>=0;i--){
        let sum = 0;
        for(let j=i;j<matrixSize;j++){
            sum += matU[i][j] * tempx[j];
        }
        tempx[i] = (tempy[i] - sum) / matU[i][i];
    }
    sety(tempy)
    setx(tempx)
    console.log(y)
    console.log(x)

  }

  const onMatrixAInput = (e, i, j) => {
    const newMatrixA = [...matrixA];
    newMatrixA[i][j] = e.target.value;
    setMatrixA(newMatrixA);
  };

  const onMatrixBInput = (e, i) => {
    const newMatrixB = [...matrixB];
    newMatrixB[i] = e.target.value;
    setMatrixB(newMatrixB);
  }

  const onClickReset = () => {
    setMatrixA(
      Array(matrixSize)
        .fill(null)
        .map(() => Array(matrixSize).fill(''))
    );
    setMatrixB(Array(matrixSize).fill(''));
  };

  const onClickCalculate = () => {
    console.log("Matrix Size:", matrixSize);
    console.log("Matrix A:", matrixA);
    console.log("Matrix B:", matrixB,"Type of B:"+typeof(matrixB[0]));

    calu();

    setsolution(printanswer());
  };


  const handleMatrixSizeChange = (e) => {
    const newSize = Number(e.target.value);
    
    let temp = []
    let differ = abs(newSize-matrixSize);
    matrixA.map((row,indexrow)=>{
      let temp2 = [...row]
      if(newSize < matrixSize){
        for(let i=0;i<differ;i++){
          temp2.pop()
        }
      }else{
        temp2 = temp2.concat(Array(differ).fill(''));
      }
      temp.push(temp2)
    })
    if(newSize > matrixSize){
      temp = temp.concat(
        Array(differ).fill(
          Array(newSize).fill('')))
    }else{
      for(let i=0;i<differ;i++){
        temp.pop();
      }
    }
    setMatrixA(temp);
    setMatrixSize(newSize);
  };
  
  const matrixToLatex = (matrix) => {
    return `
      \\begin{vmatrix}
      ${matrix.map(row => row.join(' & ')).join(' \\\\ ')}
      \\end{vmatrix}
    `;
  };


  const printanswer =()=>{
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-center">
            <InlineMath math={`[L]{Y} = ${matrixToLatex(matL)} \\text{x} 
                                \\begin{Bmatrix}
                                ${matrixB.map((_,index) => `y_${index+1}`).join(' \\\\ ')}
                                \\end{Bmatrix} 
                                = 
                                \\begin{Bmatrix}
                                ${matrixB.map((row) => row).join(' \\\\ ')}
                                \\end{Bmatrix} `} />
        </div>
        <div className='flex flex-col text-left mt-10'>
            {y.map((row,indexrow)=>(
                <InlineMath math={`y_${indexrow+1} = ${row}`} />
            ))}
        </div>


        <div className="text-center mt-10">
            <InlineMath math={`[U]{x} = ${matrixToLatex(matU)} \\text{x} 
                                \\begin{Bmatrix}
                                ${matrixB.map((_,index) => `x_${index+1}`).join(' \\\\ ')}
                                \\end{Bmatrix} 
                                = 
                                \\begin{Bmatrix}
                                ${y.map((row) => row).join(' \\\\ ')}
                                \\end{Bmatrix} `} />
        </div>
        <div className='flex flex-col text-left mt-10'>
            {x.map((row,indexrow)=>(
                <InlineMath math={`x_${indexrow+1} = ${row}`} />
            ))}
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="flex items-end gap-2 mx-auto w-fit">
        <div className="flex flex-col">
          <label>Matrix size (NxN)</label>
          <input
            type="number"
            value={matrixSize}
            onChange={handleMatrixSizeChange}
            min="2"
            className="w-40 placeholder:text-gray-300 bg-white mt-2 border border-gray-300 p-2"
          />
        </div>
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={onClickReset}
        >
          
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded mt-2"
          onClick={onClickCalculate}
        >
          Calculate
        </button>
      </div>

      <div className='flex justify-center my-10 items-center gap-5'>
        <div className="flex-none items-center gap-2 mt-2">
          <div className="text-center">
            <InlineMath math="[A]" />
            <div
              className="grid auto-cols-auto gap-1 mt-2"
              style={{
                gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {matrixA.map((row, rowIndex) =>
                row.map((_, colIndex) => (
                  <input
                    key={`matrix_a_${rowIndex}_${colIndex}`}
                    type="number"
                    value={matrixA[rowIndex][colIndex]}
                    onChange={(e) => onMatrixAInput(e, rowIndex, colIndex)}
                    className="h-20 w-20 text-center placeholder:text-gray-300 bg-white border rounded"
                    placeholder={`a${rowIndex + 1}${colIndex + 1}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className='felx-none item-center mt-2 gap-2'>
          <div className='text-center'>
              <InlineMath math="[x]"/>
              <div
              className="grid auto-rows-auto gap-1 mt-2"
              style={{
                gridTemplateRows: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {Array.from({ length:matrixSize }).map((_,i) => (
                <input
                className="h-20 w-20 text-center placeholder:text-gray-200 bg-grey border rounded"
                placeholder={`x${i+1}`}
                disabled={"Disable Inputs"}
              />
              ))}
            </div>
          </div>

        </div>

          <InlineMath math="="/>

        <div className='flex-none items-center gap-2 mt-2'>
          <div className="text-center">
          <InlineMath math="[B]"/>
            <div
              className="grid auto-rows-auto gap-1 mt-2"
              style={{
                gridTemplateRows: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {Array.from({ length: matrixSize }).map((_, i) => (
                <input
                  key={`matrix_b_${i}`}
                  type="number"
                  value={matrixB[i]}
                  onChange={(e) => onMatrixBInput(e, i)}
                  className="h-20 w-20 text-center placeholder:text-gray-300 bg-white border rounded"
                  placeholder={`b${i+1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='card bg-base-100 shadow-xl w-auto min-h-56 flex flex-1'>
        {solution}
      </div>
      
    </>
  );
};

export default Lu;
