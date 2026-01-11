import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import evaluationService from '../api/services/evaluationService';
import { useAuth } from '../context/AuthContext';

const EvaluationTaker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [evaluation, setEvaluation] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                // Primero intentar obtener los resultados para ver si ya completó la evaluación
                try {
                    const resultsResponse = await evaluationService.getResults(id);
                    if (resultsResponse.data?.resultado || resultsResponse.resultado) {
                        setResult(resultsResponse.data?.resultado || resultsResponse.resultado);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.log('No hay resultados previos, cargando evaluación...');
                }

                // Si no tiene resultados, cargar la evaluación para que pueda responderla
                const response = await evaluationService.getById(id);
                const evaluationData = response.data || response;
                setEvaluation(evaluationData);

                // Inicializar timer si hay duración
                if (evaluationData.duracion) {
                    setTimeLeft(evaluationData.duracion * 60);
                }
            } catch (error) {
                console.error('Error fetching evaluation:', error);
                alert('Error al cargar la evaluación');
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluation();
    }, [id]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || result) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    const handleAnswerChange = (questionIndex, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const unanswered = evaluation.preguntas.filter((_, index) => answers[index] === undefined);
        if (unanswered.length > 0 && e) {
            if (!window.confirm(`Tienes ${unanswered.length} pregunta(s) sin responder. ¿Deseas enviar de todas formas?`)) {
                return;
            }
        }

        setSubmitting(true);
        try {
            // Construir array de respuestas con el formato que espera el backend
            const formattedAnswers = evaluation.preguntas.map((pregunta, index) => {
                const selectedOptionIndex = answers[index];

                if (selectedOptionIndex === undefined || selectedOptionIndex === null) {
                    return {
                        idPregunta: pregunta.idPregunta,
                        idOpcionSeleccionada: null,
                        respuestaTexto: null
                    };
                }

                const selectedOption = pregunta.opciones[selectedOptionIndex];
                return {
                    idPregunta: pregunta.idPregunta,
                    idOpcionSeleccionada: selectedOption?.idOpcion || null,
                    respuestaTexto: null
                };
            });

            console.log('Respuestas enviadas:', formattedAnswers);
            const response = await evaluationService.submit(id, formattedAnswers);
            setResult(response.data?.resultado || response.data);
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            alert('Error al enviar la evaluación');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;

    // Show results if already completed
    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 pb-10">
                <div className="bg-teal-600 text-white py-8">
                    <div className="container mx-auto px-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-teal-100 hover:text-white mb-4 flex items-center"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-3xl font-bold">Resultados de la Evaluación</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 mt-8 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="mb-6">
                            <div className={`text-6xl font-bold ${result.calificacion >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {result.calificacion}%
                            </div>
                            <p className="text-gray-600 mt-2">
                                {result.correctas || 0} de {result.total || evaluation?.preguntas?.length || 0} correctas
                            </p>
                        </div>

                        {result.calificacion >= 70 ? (
                            <div className="text-green-600 text-xl font-semibold mb-4">
                                ¡Felicitaciones! Has aprobado
                            </div>
                        ) : (
                            <div className="text-red-600 text-xl font-semibold mb-4">
                                No has alcanzado la nota mínima
                            </div>
                        )}

                        <button
                            onClick={() => navigate(-1)}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
                        >
                            Volver al Curso
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!evaluation) return <div className="text-center py-10">Evaluación no encontrada</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="bg-teal-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{evaluation.titulo}</h1>
                            {evaluation.descripcion && (
                                <p className="text-teal-100">{evaluation.descripcion}</p>
                            )}
                        </div>
                        {timeLeft !== null && (
                            <div className="bg-teal-700 px-6 py-3 rounded-lg">
                                <div className="text-sm text-teal-200">Tiempo restante</div>
                                <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-300' : ''}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {evaluation.preguntas?.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-semibold text-gray-800 text-lg mb-4">
                                    {qIndex + 1}. {question.textoPregunta || question.pregunta}
                                </h3>
                                <div className="space-y-3">
                                    {question.opciones?.map((option, oIndex) => (
                                        <label
                                            key={oIndex}
                                            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${answers[qIndex] === oIndex
                                                ? 'border-teal-600 bg-teal-50'
                                                : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={oIndex}
                                                checked={answers[qIndex] === oIndex}
                                                onChange={() => handleAnswerChange(qIndex, oIndex)}
                                                className="h-4 w-4 text-teal-600 mr-3"
                                            />
                                            <span className="text-gray-700">
                                                {String.fromCharCode(65 + oIndex)}. {option.texto || option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center bg-white rounded-lg shadow-md p-6">
                        <div className="text-gray-600">
                            Respondidas: {Object.keys(answers).length} de {evaluation.preguntas?.length || 0}
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 font-medium"
                        >
                            {submitting ? 'Enviando...' : 'Enviar Evaluación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationTaker;
