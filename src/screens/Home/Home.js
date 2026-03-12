import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Nav/Navbar';
import History from '../../components/Hist/History';
import LineNumbers from '../../components/LineNumbers/LineNumbers';
import './Home.css';
import { environments } from '../../environments/environments';
import { toast } from 'react-toastify';
 
const Home = ({ isDarkMode, toggleTheme, isLoggedIn, onLogout }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
     setHistory([])
    }
  }, [isLoggedIn]);
  
  const convertToTypeScript = () => {
    try {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (jsonError) {
        try {
          parsedInput = new Function(`return ${input};`)();
        } catch (jsError) {
          throw new Error('Input is neither valid JSON nor valid JavaScript object');
        }
      }
  
      if (typeof parsedInput === 'object' && !Array.isArray(parsedInput) && parsedInput !== null) {
        const interfaceString = generateInterface('GeneratedInterface', parsedInput);
        setOutput(interfaceString);
      } else {
        const typeString = generateType(parsedInput);
        setOutput(typeString);
      }
    } catch (error) {
      setOutput('Invalid input. Please provide a valid JSON object or JavaScript object literal.');
    }
  };
  const generateInterface = (interfaceName, obj, indentLevel = 0) => {
    const indent = '  '.repeat(indentLevel);
    let interfaceString = `interface ${interfaceName} {\n`;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const type = getType(value, key, indentLevel + 1);
        interfaceString += `${indent}  ${key}: ${type};\n`;
      }
    }
    
    interfaceString += `${indent}}`;
    return interfaceString;
  };
  
  const getType = (value, key, indentLevel = 1) => {
    const indent = '  '.repeat(indentLevel);
    
    if (typeof value === 'string') {
      return 'string';
    } else if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'any[]';
      }
      const arrayType = getType(value[0], key, indentLevel);
      return `${arrayType}[]`;
    } else if (typeof value === 'object') {
      let objectType = '{\n';
      
      for (const objKey in value) {
        if (value.hasOwnProperty(objKey)) {
          const nestedValue = value[objKey];
          const nestedType = getType(nestedValue, objKey, indentLevel + 1);
          objectType += `${indent}  ${objKey}: ${nestedType};\n`;
        }
      }
      
      objectType += `${indent}}`;
      return objectType;
    }
    
    return 'any';
  };
  

  const generateType = (value) => {
    const type = typeof value;
    return `type GeneratedType = ${type};`;
  };

  const formatInput = () => {
    try {
      const parsedInput = JSON.parse(input);
      setInput(JSON.stringify(parsedInput, null, 2));
    } catch (err) {
      alert('Invalid JSON input');
    }
  };

  const formatOutput = () => {
    try {
      const lines = output.split('\n');
      const formattedOutput = lines.map(line => `  ${line}`).join('\n');
      setOutput(formattedOutput);
    } catch (err) {
      alert('Unable to format output');
    }
  };

  const saveConversion = async () => {
    if (!isLoggedIn) {
       toast.info('Please log in to save your conversion.', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDarkMode ? 'dark' : 'light',
              });
      return;
    }
    try {
      const response = await fetch( environments.apiUrl+'/api/history/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ input, output }),
      });
      const data = await response.json();
      if (data.message) {
        toast.info('Conversion saved!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? 'dark' : 'light',
        });
        fetchHistory();
      }
    } catch (err) {
      alert('Error saving conversion');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(environments.apiUrl+'/api/history/fetch', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if(response.status == 400){
        toast.info("session expired, please login to continue")
        return;
      }
      const data = await response.json();
      if(data){
        setHistory(data);
      }else{
        setHistory([]);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  return (
    <div className="home">
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
      <div className="container">
        <div className="input-section">
          <div className='header'>Input JSON</div>
          <div className="code-editor-container">
            <LineNumbers lines={input.split('\n')} />
            <textarea
              className={`code-editor ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
              placeholder='Example: {"name": "John", "age": 30} or "Hello World"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button onClick={formatInput}>Format Input</button>
          <button onClick={convertToTypeScript}>Convert</button>
        </div>

        <div className="output-section">
          <div className='header'>Output TypeScript</div>
          <div className="code-editor-container">
            <LineNumbers lines={output.split('\n')} />
            <textarea
              className={`code-editor ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
              value={output}
              readOnly
            />
          </div>
          <button onClick={formatOutput}>Format Output</button>
          <button onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
          <button onClick={saveConversion}>Save</button>
        </div>
      </div>
      <History history={history} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Home;