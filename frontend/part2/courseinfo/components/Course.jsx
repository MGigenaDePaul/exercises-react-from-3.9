const Header = ({course}) => <h2>{course}</h2>

const Total = ({courses}) => {
    const initialValue = 0
    const total = courses.parts.reduce((accumulator, part) => {
        console.log('What is happening ', accumulator, part)
        return accumulator + part.exercises
    }, initialValue)

    return (
        <b> <p>total of {total} exercises</p> </b>
    )
}

const Content = ({parts}) => {
    console.log("parts", parts)
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part} />)}
        </div>
    )
}

const Part = ({part}) => <p> {part.name} {part.exercises} </p>



const Course = () => {
    const courses = [
        {
        name: 'Half Stack application development',
        id: 1,
        parts: [
            {
            name: 'Fundamentals of React',
            exercises: 10,
            id: 1
            },
            {
            name: 'Using props to pass data',
            exercises: 7,
            id: 2
            },
            {
            name: 'State of a component',
            exercises: 14,
            id: 3
            },
            {
            name: 'Redux',
            exercises: 11,
            id: 4
            }
        ]
        }, 
        {
        name: 'Node.js',
        id: 2,
        parts: [
            {
            name: 'Routing',
            exercises: 3,
            id: 1
            },
            {
            name: 'Middlewares',
            exercises: 7,
            id: 2
            }
        ]
        }
    ]

    return (
        <div>
            <h1>Web development curriculum</h1>
            <Header course={courses[0].name} />
            <Content parts={courses[0].parts} />
            <Total courses={courses[0]} />
            <Header course={courses[1].name} />
            <Content parts={courses[1].parts} />
            <Total courses={courses[1]} />
        </div>
    )
}

export default Course