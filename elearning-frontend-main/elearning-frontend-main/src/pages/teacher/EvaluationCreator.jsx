import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import evaluationService from '../../api/services/evaluationService';

const EvaluationCreator = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [evaluationData, setEvaluationData] = useState({
        titulo: '',
        descripcion: '',
        duracion: '',
        fechaLimite: '',
        idCurso: courseId
    });

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        pregunta: '',
        opciones: ['', '', '', ''],
        respuestaCorrecta: 0
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvaluationData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion(prev => ({ ...prev, pregunta: e.target.value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.opciones];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({ ...prev, opciones: newOptions }));
    };

    const handleCorrectAnswerChange = (index) => {
        setCurrentQuestion(prev => ({ ...prev, respuestaCorrecta: index }));
    };

    const addQuestion = () => {
        if (!currentQuestion.pregunta.trim() || currentQuestion.opciones.some(opt => !opt.trim())) {
            alert('Por favor completa la pregunta y todas las opciones');
            return;
        }

        setQuestions([...questions, { ...currentQuestion }]);
        setCurrentQuestion({
            pregunta: '',
            opciones: ['', '', '', ''],
            respuestaCorrecta: 0
        });
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert('Debes agregar al menos una pregunta');
            return;
        }

        setSaving(true);
        try {
            // Prepare payload with required fields
            const payload = {
                titulo: evaluationData.titulo,
                idCurso: parseInt(courseId),
                preguntas: questions,
                descripcion: evaluationData.descripcion || '',
                fechaInicio: new Date().toISOString(), // Current date as start
                fechaFin: evaluationData.fechaLimite
                    ? new Date(evaluationData.fechaLimite).toISOString()
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days from now
            };

            await evaluationService.create(payload);

            alert('Evaluación creada exitosamente');
            navigate(`/courses/${courseId}`);
        } catch (error) {
            console.error('Error creating evaluation:', error);
            alert('Error al crear la evaluación');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="bg-teal-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="text-teal-100 hover:text-white mb-4 flex items-center"
                    >
                        ← Volver al Curso
                    </button>
                    <h1 className="text-3xl font-bold">Crear Nueva Evaluación</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Información Básica</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={evaluationData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ej: Examen Final - Módulo 1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                                <textarea
                                    name="descripcion"
                                    value={evaluationData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describe el contenido de la evaluación..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                                    <input
                                        type="number"
                                        name="duracion"
                                        value={evaluationData.duracion}
                                        onChange={handleChange}
                                        placeholder="60"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite (Opcional)</label>
                                    <input
                                        type="date"
                                        name="fechaLimite"
                                        value={evaluationData.fechaLimite}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Preguntas ({questions.length})</h2>

                        {/* Added Questions List */}
                        {questions.length > 0 && (
                            <div className="mb-6 space-y-3">
                                {questions.map((q, index) => (
                                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-medium text-gray-800">{index + 1}. {q.pregunta}</p>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                            {q.opciones.map((opt, i) => (
                                                <li key={i} className={i === q.respuestaCorrecta ? 'text-green-600 font-medium' : ''}>
                                                    {String.fromCharCode(65 + i)}. {opt} {i === q.respuestaCorrecta && '✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add New Question Form */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Agregar Nueva Pregunta</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                                    <input
                                        type="text"
                                        value={currentQuestion.pregunta}
                                        onChange={handleQuestionChange}
                                        placeholder="Escribe la pregunta aquí..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                                    {currentQuestion.opciones.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3 mb-2">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={currentQuestion.respuestaCorrecta === index}
                                                onChange={() => handleCorrectAnswerChange(index)}
                                                className="h-4 w-4 text-teal-600"
                                            />
                                            <span className="text-sm font-medium text-gray-600 w-6">{String.fromCharCode(65 + index)}.</span>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                    ))}
                                    <p className="text-xs text-gray-500 mt-2">Selecciona la opción correcta marcando el círculo</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                                >
                                    + Agregar Pregunta
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 font-medium"
                        >
                            {saving ? 'Creando...' : 'Crear Evaluación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationCreator;
