'use client';
import { useState, useRef, useEffect } from 'react';

export default function TagInput({ tags, suggestions, onAddTag, onRemoveTag }) {
	const [tagInput, setTagInput] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
	const inputRef = useRef(null);
	const suggestionsRef = useRef(null);

	// Filtrar sugerencias basadas en el input y tags existentes
	useEffect(() => {
		if (tagInput.trim()) {
			const filtered = suggestions.filter(
				(suggestion) =>
					!tags.includes(suggestion) &&
					suggestion.toLowerCase().includes(tagInput.toLowerCase())
			);
			setFilteredSuggestions(filtered);
			setSelectedSuggestionIndex(filtered.length > 0 ? 0 : -1);
		} else {
			setFilteredSuggestions([]);
			setSelectedSuggestionIndex(-1);
		}
	}, [tagInput, tags, suggestions]);

	// Manejar cambios en el input
	const handleInputChange = (e) => {
		const value = e.target.value;
		setTagInput(value);
		setShowSuggestions(value.trim().length > 0);
	};

	// Añadir tag y limpiar input
	const addTag = (tag) => {
		const trimmedTag = tag.trim();
		if (trimmedTag && onAddTag(trimmedTag)) {
			setTagInput('');
			setShowSuggestions(false);
			setTimeout(() => inputRef.current?.focus(), 10);
		}
	};

	// Manejar teclas especiales (Enter, flecha arriba/abajo, Escape)
	const handleKeyDown = (e) => {
		const hasSuggestions = filteredSuggestions.length > 0;

		switch (e.key) {
			case 'Enter':
				e.preventDefault();
				if (selectedSuggestionIndex >= 0 && hasSuggestions) {
					// Si hay una sugerencia seleccionada, usarla
					addTag(filteredSuggestions[selectedSuggestionIndex]);
				} else if (tagInput.trim()) {
					// Si no hay sugerencia seleccionada pero hay texto, usarlo
					addTag(tagInput);
				}
				break;

			case 'ArrowDown':
				if (hasSuggestions) {
					e.preventDefault();
					setSelectedSuggestionIndex((prevIndex) =>
						prevIndex < filteredSuggestions.length - 1
							? prevIndex + 1
							: 0
					);
				}
				break;

			case 'ArrowUp':
				if (hasSuggestions) {
					e.preventDefault();
					setSelectedSuggestionIndex((prevIndex) =>
						prevIndex > 0
							? prevIndex - 1
							: filteredSuggestions.length - 1
					);
				}
				break;

			case 'Escape':
				setShowSuggestions(false);
				setSelectedSuggestionIndex(-1);
				break;

			case 'Backspace':
				// Si el input está vacío y hay tags, eliminar el último
				if (tagInput === '' && tags.length > 0) {
					onRemoveTag(tags[tags.length - 1]);
				}
				break;
		}
	};

	// Cerrar sugerencias al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target) &&
				!inputRef.current.contains(event.target)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="relative">
			<div className="flex flex-wrap gap-2 p-2 bg-background border border-gray-700 rounded-lg min-h-10">
				{tags.map((tag, index) => (
					<span
						key={index}
						className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900 text-primary-300 border border-primary-700"
					>
						{tag}
						<button
							type="button"
							onClick={() => onRemoveTag(tag)}
							className="ml-1.5 text-primary-400 hover:text-primary-200 focus:outline-none"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3.5 w-3.5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					type="text"
					value={tagInput}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className="flex-grow min-w-20 bg-transparent border-none focus:outline-none text-white text-sm py-1"
					placeholder={
						tags.length ? 'Añadir más tags...' : 'Añadir tags...'
					}
					onFocus={() => tagInput.trim() && setShowSuggestions(true)}
				/>
			</div>

			{showSuggestions && filteredSuggestions.length > 0 && (
				<div
					ref={suggestionsRef}
					className="absolute z-10 mt-1 w-full bg-surface border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
				>
					{filteredSuggestions.map((suggestion, i) => (
						<div
							key={i}
							className={`px-4 py-2 cursor-pointer text-white text-sm ${
								i === selectedSuggestionIndex
									? 'bg-primary-900'
									: 'hover:bg-background'
							}`}
							onClick={() => addTag(suggestion)}
						>
							{suggestion}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
