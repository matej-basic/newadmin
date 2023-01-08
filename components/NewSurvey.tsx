import React, { useEffect, useState } from 'react';
import { Question } from '../interfaces/survey';

const Survey = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState()
    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        const fetchQuestions = async () => {
            const fetchedQuestions = await fetch('/api/questions', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await fetchedQuestions.json();

            const qs: Question[] = []

            data['questions'].forEach(q => {
                const newQuestion: Question = {
                    text: q.text,
                    choices: q.choices
                }
                qs.push(newQuestion)
            })

            setQuestions((vals) => {
                return [...qs]
            })
        }

        fetchQuestions().catch(err => { console.log("Error fetching questions: " + err) })
    }, [])

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer)
        setAnswers([...answers, answer]);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSubmit = () => {
        // Submit answers to server or save to local storage
        if (currentPage + 1 == questions.length) {
            // Submit to backend
            console.log("Answers: " + JSON.stringify(answers))
        } else {
            setCurrentPage(currentPage + 1);
            setSelectedAnswer(null);
        }
    };

    const currentQuestion = questions[currentPage];
    if (questions.length > 0 && currentPage > 0) {
        return (
            <div className="bg-gray-200 rounded-lg w-1/5 max-w-lg mx-auto mt-8 p-4 text-left">
                <h1 className="mb-4 font-bold text-2xl text-center">{currentQuestion.text}</h1>
                <div className="column">
                    {currentQuestion.choices.map((choice) => (
                        <div key={choice} className="mb-4 float-le">
                            <input
                                type="radio"
                                name="choice"
                                id={choice}
                                value={choice}
                                checked={selectedAnswer === choice}
                                onChange={() => {
                                    handleAnswer(choice);
                                }}
                            />
                            <label className="font-bold text-lg" htmlFor={choice}>
                                {choice}
                            </label>
                        </div>
                    ))}
                    <div className="mb-4 flex justify-between">
                        {currentPage > 0 && (
                            <button onClick={handlePrevPage} className="font-bold text-lg">
                                Prev
                            </button>
                        )}
                        {currentPage <= questions.length - 1 && (
                            <button
                                onClick={handleSubmit}
                                className="font-bold text-lg px-4 py-2 rounded-full bg-blue-500 text-white text-center mx-auto bottom-0"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    } else if (questions.length > 0 && currentPage == 0) {
        return (
            <div className="bg-gray-200 rounded-lg w-1/5 max-w-lg mx-auto mt-8 p-4 text-left">
                <h1 className="mb-4 font-bold text-2xl text-center">{currentQuestion.text}</h1>
                <div className="column">
                    <form onSubmit={handleSubmit}>
                        <input className='ml-10 text-center rounded-full' type="text" name="Name" onChange={(e) => handleAnswer(e.target.value)} />
                    </form>
                </div>
            </div>
        )
    }

};

export default Survey;
