import { useState, useEffect } from 'react';

const useMultiFetch = (endpoints) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const responses = await Promise.all(endpoints.map(({ url }) => fetch(url)))
        const result = await Promise.all(
          responses.map((response) => {
            if (!response.ok) throw new Error('Failed to fetch data from API')
            return response.json()
          })
        )
        console.log("multiFetch result: ", result)

        const mappedData = {};
        endpoints.forEach((endpoint, index) => {
          mappedData[endpoint.key] = result[index];
        });

        setData(mappedData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoints])

  return { data, loading, error }
}

export default useMultiFetch