import React, { useEffect, useState } from 'react';
import { Question } from '../interfaces/survey';
import Element from './Recommendation';

const Survey = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState()
    const [questions, setQuestions] = useState<Question[]>([])
    const [recommendations, setRecommendations] = useState([])
    var renderedRecommendationsOffice;
    var renderedRecommendationsCreative;
    var renderedRecommendationsCompute;

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

    const updateRecommendations = (values) => {
        var rcmds = []
        values.forEach(value => {
            const newRecom = {
                name: value.name,
                price: value.price,
                url: value.url
            }
            rcmds.push(newRecom)
        });

        setRecommendations(rcmds)
    }

    const handleSubmit = () => {
        // Submit answers to server or save to local storage
        if (currentPage + 1 == questions.length) {
            // Submit to backend
            console.log("Answers: " + JSON.stringify(answers))
            const postQuestions = async () => {
                const newAnswer = {
                    name: answers[0],
                    answers: answers.slice(1)
                }
                const posting = await fetch('/api/survey', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newAnswer)
                })

                const res = await posting.json()
                const recommendation = res['recommendation']
                updateRecommendations(recommendation)
                setCurrentPage(currentPage + 1);
            }

            postQuestions().catch(err => { console.log("Error posting questions: " + err) })

        } else {
            setCurrentPage(currentPage + 1);
            setSelectedAnswer(null);
        }
    };

    if (recommendations.length > 0) {
        renderedRecommendationsOffice = Object.values(recommendations.slice(0, 3)).map(rcm => {
            return (
                <Element name={rcm.name} url={rcm.url} price={rcm.price} />
            )
        })

        if (answers.length > 0 && answers[3] != "0") {
            renderedRecommendationsCreative = Object.values(recommendations.slice(3, 6)).map(rcm => {
                return (
                    <Element name={rcm.name} url={rcm.url} price={rcm.price} />
                )
            })
        }

        if (answers.length > 0 && answers[5] != "I don't require a virtual computer") {
            renderedRecommendationsCompute = Object.values(recommendations.slice(-3)).map(rcm => {
                return (
                    <Element name={rcm.name} url={rcm.url} price={rcm.price} />
                )
            })
        }
    }

    const currentQuestion = questions[currentPage];
    if (questions.length > 0 && currentPage > 0 && currentPage <= questions.length - 1) {
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
            <div className="bg-gray-200 rounded-lg column w-1/5 max-w-lg mx-auto mt-8 p-4 text-left">
                <h1 className="mb-4 font-bold text-2xl text-center">{currentQuestion.text}</h1>
                <div className="flex flex-col justify-center items-center">
                    <input className='flex text-center rounded-full' type="text" name="Name" onChange={(e) => handleAnswer(e.target.value)} />
                    <div className="mt-6 flex justify-between text-center">
                        <input onClick={handleSubmit} value="Submit" type="button" className='font-bold text-lg px-4 py-2 rounded-full bg-blue-500 text-white text-center mx-auto bottom-0 ' />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="rounded-lg w-1/3 max-w-lg mx-auto mt-8 p-4 text-left">
                <div className="pl-4">
                    <h1 className="mb-4 font-bold text-2xl text-center">Recommendations</h1>
                    <div className='column'>
                        <h2 className='font-bold text-2x1 text-center'>Office packages</h2>
                        <div className="mb-4 flex items-right float-left">
                            {renderedRecommendationsOffice}
                        </div>
                    </div>
                    <div className='column'>
                        {answers[3] != "0" && <h2 className='font-bold text-2x1 text-center'>Creative packages</h2>}
                        <div className="mb-4 flex items-right float-left">
                            {renderedRecommendationsCreative}
                        </div>
                    </div>
                    <div className='column'>
                        {answers[5] != "I don't require a virtual computer" && <h2 className='font-bold text-2x1 text-center'>Compute packages</h2>}
                        <div className="mb-4 flex items-right float-left">
                            {renderedRecommendationsCompute}
                        </div>
                    </div>
                </div>
            </div >

        )
    }

};

export default Survey;
