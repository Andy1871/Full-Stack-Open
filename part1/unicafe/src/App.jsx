import { useState } from 'react'

const StatisticLine = (props) => {
    return (
        <tr>
          <td>{props.text}</td>
          <td>{props.value}</td>
        </tr>    
    )
}

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </>
    )
  }

  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.good + props.neutral + props.bad} />
          <StatisticLine text="average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad) || 0} />
          <StatisticLine text="positive" value={((props.good / (props.good + props.neutral + props.bad)) * 100 || 0) + '%'} />
        </tbody>
      </table>
    </>
  )
}


const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>

      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />


      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
