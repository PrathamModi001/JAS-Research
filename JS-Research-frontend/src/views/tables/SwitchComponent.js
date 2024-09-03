import { useEffect } from 'react'
import styles from './SwitchComponent.module.css'
import classNames from 'classnames'

function SwitchComponent({ options, setState, value }) {
  const handleOnClick = index => {
    setState(index)
    value = index
  }

  console.log(options, setState, value)

  useEffect(() => {
    if (!options || !setState || !value.toString()) {
      throw new Error('Please enter all the props( options, setState, value')
    }
  }, [options, setState, value])

  return (
    <>
      <div className={styles.customToggle}>
        <div className={classNames(styles.toggleIn)}>
          <span
            onClick={() => handleOnClick(1)}
            className={classNames({
              [styles.active]: value === 1
            })}
          >
            <p>{options[0]}</p>
          </span>
          <span
            onClick={() => handleOnClick(2)}
            className={classNames({
              [styles.active]: value === 2
            })}
          >
            <p>{options[1]}</p>
          </span>
          <span
            className={classNames(styles.bg, {
              [styles.activeIndex1]: value === 1,
              [styles.activeIndex2]: value === 2
            })}
          />
        </div>
      </div>
    </>
  )
}

export default SwitchComponent
