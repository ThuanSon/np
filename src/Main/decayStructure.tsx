import axios from "axios";
import React, { useState, useEffect } from "react";

interface DecayStructureProps {
  data: string;
}

const DecayStructure: React.FC<DecayStructureProps> = ({ data }) => {
  const [resData, setResData] = useState<any[]>([]);

  const handleData = () => {
    const output = data.split(" ").filter((item: string) => item !== "");
    return output;
  };

  const output = handleData();

  const fetchData = async (data: string[]) => {
    const results = [];
    for (const item of data) {
      const res = await axios.get(
        `https://dictionaryapi.com/api/v3/references/learners/json/${item}?key=68e57a54-8b7f-4122-9b42-5d499eb6eff0`
      );
      results.push(res.data);
    }
    setResData(results);
  };

  useEffect(() => {
    fetchData(output);
  }, [data]);
  console.log(resData?.[0]?.[0]?.meta?.id);

  return (
    <div>
      {output.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
      <div>
        <h3>API Responses:</h3>
        {resData.map((response, index) => (
          <div key={index}>
            <pre>
              {response?.[0]?.meta?.id === "a:1"
                ? JSON.stringify(response?.[1]?.fl, null, 2)
                : JSON.stringify(response?.[0]?.fl, null, 2)}
            </pre>
            {/* <pre>
              {JSON.stringify(response?.[0].fl, null, 2)}
            </pre> */}
          </div>
        ))}
        {/* {resData[0]} */}
        {/* <div>
          <pre>{JSON.stringify(resData[0][0]['fl'], null, 2)}</pre>
        </div> */}
      </div>
    </div>
  );
};

export default DecayStructure;
