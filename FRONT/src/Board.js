import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';

import { UilTimesSquare } from '@iconscout/react-unicons'
  
Modal.setAppElement('#root');

function Board() {
    const [todoCards, setTodoCards] = useState([]);
    const [doingCards, setDoingCards] = useState([]);
    const [doneCards, setDoneCards] = useState([]);
    
    const [modalAddIsOpen, setAddIsOpen] = React.useState(false);
    const [modalEditIsOpen, setEditIsOpen] = React.useState(false);

    const [id, setId] = useState('');
    const [titulo, setTitle] = useState('');
    const [conteudo, setContent] = useState('');
    const [lista, setList] = useState('todo');

    function openAddModal() { setAddIsOpen(true); }
    function closeAddModal() { setAddIsOpen(false); }

    const openEditModal = (id, titulo, conteudo, lista) => {
        setId(id);
        setTitle(titulo);
        setContent(conteudo);
        setList(lista);
        setEditIsOpen(true);
      };
    
      const closeEditModal = () => {
        setTitle("");
        setContent("");
        setList("");
        setEditIsOpen(false);
      };


    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };
        axios
          .get("http://localhost:8000/cards/", config)
          .then(response => {
            // Filtrando a lista de produtos por um valor vindo do GET
            const todoCards = response.data.filter(todos => todos.lista === "todo");
            const doingCards = response.data.filter(doing => doing.lista === "doing");
            const doneCards = response.data.filter(done => done.lista === "done");
            setTodoCards(todoCards);
            setDoingCards(doingCards);
            setDoneCards(doneCards);
          })
          .catch((error) => console.log(error));
        },
    []);

    const fetchCards = () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };

        axios.get("http://localhost:8000/cards/", config)
          .then(response => {
            // Filtrando a lista de produtos por um valor vindo do GET
            const todoCards = response.data.filter(todos => todos.lista === "todo");
            const doingCards = response.data.filter(doing => doing.lista === "doing");
            const doneCards = response.data.filter(done => done.lista === "done");
            setTodoCards(todoCards);
            setDoingCards(doingCards);
            setDoneCards(doneCards);
          })
          .catch((error) => console.log(error));     
    };

    const addCard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };
        try {
          const response = await axios.post('http://localhost:8000/cards/', {
            titulo,
            conteudo,
            lista,
          }, config);
          console.log(response.data); // Aqui você pode ver a resposta do servidor
          closeAddModal();
          fetchCards();
        } catch (error) {
          console.error(error);
        }
    };

    const editCard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };
        try {
          const response = await axios.put('http://localhost:8000/cards/' + id, {
            id,
            titulo,
            conteudo,
            lista,
          }, config);
          console.log(response.data); // Aqui você pode ver a resposta do servidor
          closeEditModal();
          fetchCards();
        } catch (error) {
          console.error(error);
        }
    };

    const removeCard = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };
        try {
          const response = await axios.delete('http://localhost:8000/cards/' + id, config);
          console.log(response.data); // Aqui você pode ver a resposta do servidor
          alert("Cartão removido com sucesso!");
          fetchCards();
        } catch (error) {
          console.error(error);
        }
    };

    return (
        <BoardContent>
            <BoardTop>
                <BoardTitle>Meu quadro de atividades</BoardTitle>
                <ButtonCreateCard onClick={openAddModal}>Criar nova tarefa</ButtonCreateCard>
                <Modal isOpen={modalAddIsOpen} onRequestClose={closeAddModal} style={CreateNewCard}>
                    <ModalTitle>Adicionar novo card</ModalTitle>
                    <ButtoncloseAddModal onClick={closeAddModal}>
                        <UilTimesSquare size="36" color="#E40049" />
                    </ButtoncloseAddModal>
                    <FormContent onSubmit={addCard}>
                        <LabelForm>Título:</LabelForm>
                        <InputForm type="text" value={titulo} onChange={(e) => setTitle(e.target.value)} />
                        <LabelForm>Conteúdo:</LabelForm>
                        <TextareaForm value={conteudo} onChange={(e) => setContent(e.target.value)} />
                        <LabelForm>Status:</LabelForm>
                        <SelectForm id="lista" value={lista} onChange={(event) => setList(event.target.value)}>
                            <option value="todo">To-do</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                        </SelectForm>
                        <ButtonForm type="submit">Enviar</ButtonForm>
                        <ReactMarkdown>{conteudo}</ReactMarkdown>
                    </FormContent>
                </Modal>
            </BoardTop>
            <ColumnToDo>
                <HeaderColumn>To-do</HeaderColumn>
                {todoCards.map((todo) => (
                <Card key={todo.id}>
                    <CardTitle>{todo.titulo}</CardTitle> 
                    <ReactMarkdown>{todo.conteudo}</ReactMarkdown>
                    <CardFooter>
                        <ButtonOpenCard onClick={() => openEditModal(todo.id, todo.titulo, todo.conteudo, todo.lista)}>Editar</ButtonOpenCard>
                        <ButtonDeleteCard onClick={() => removeCard(todo.id)}>Remover</ButtonDeleteCard>
                    </CardFooter>
                    <Modal isOpen={modalEditIsOpen} onRequestClose={closeEditModal} style={CreateNewCard}>
                        <ModalTitle>Alterar card</ModalTitle>
                        <ButtoncloseAddModal onClick={closeEditModal}>
                            <UilTimesSquare size="36" color="#E40049" />
                        </ButtoncloseAddModal>
                        <FormContent onSubmit={editCard}>
                            <InputForm type="hidden" value={todo.id}  />
                            <LabelForm>Título:</LabelForm>
                            <InputForm type="text" value={todo.titulo} onChange={(e) => setTitle(e.target.value)} />
                            <LabelForm>Conteúdo:</LabelForm>
                            <TextareaForm value={todo.conteudo} onChange={(e) => setContent(e.target.value)} />
                            <LabelForm>Status:</LabelForm>
                            <SelectForm id="lista" value={todo.lista} onChange={(event) => setList(event.target.value)}>
                                <option value="todo">To-do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </SelectForm>
                            <ButtonForm type="submit">Enviar</ButtonForm>
                            <ReactMarkdown>{conteudo}</ReactMarkdown>
                        </FormContent>
                    </Modal>
                </Card>
                ))}
            </ColumnToDo>
            <ColumnDoing>
                <HeaderColumn>Doing</HeaderColumn>
                {doingCards.map((doing) => (
                <Card key={doing.id}>
                    <CardTitle>{doing.titulo}</CardTitle> 
                    <ReactMarkdown>{doing.conteudo}</ReactMarkdown>
                    <CardFooter>
                        <ButtonOpenCard onClick={() => openEditModal(doing.id, doing.titulo, doing.conteudo, doing.lista)}>Editar</ButtonOpenCard>
                        <ButtonDeleteCard onClick={() => removeCard(doing.id)}>Remover</ButtonDeleteCard>
                    </CardFooter>
                    <Modal isOpen={modalEditIsOpen} onRequestClose={closeEditModal} style={CreateNewCard}>
                        <ModalTitle>Alterar card</ModalTitle>
                        <ButtoncloseAddModal onClick={closeEditModal}>
                            <UilTimesSquare size="36" color="#E40049" />
                        </ButtoncloseAddModal>
                        <FormContent onSubmit={editCard}>
                            <InputForm type="hidden" value={doing.id}  />
                            <LabelForm>Título:</LabelForm>
                            <InputForm type="text" value={titulo} onChange={(e) => setTitle(e.target.value)} />
                            <LabelForm>Conteúdo:</LabelForm>
                            <TextareaForm value={conteudo} onChange={(e) => setContent(e.target.value)} />
                            <LabelForm>Status:</LabelForm>
                            <SelectForm id="lista" value={lista} onChange={(event) => setList(event.target.value)}>
                                <option value="todo">To-do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </SelectForm>
                            <ButtonForm type="submit">Enviar</ButtonForm>
                            <ReactMarkdown>{conteudo}</ReactMarkdown>
                        </FormContent>
                    </Modal>
                </Card>
                ))}
            </ColumnDoing>
            <ColumnDone>
                <HeaderColumn>Done</HeaderColumn>
                {doneCards.map((done) => (
                    <Card key={done.id}>
                        <CardTitle>{done.titulo}</CardTitle> 
                        <ReactMarkdown>{done.conteudo}</ReactMarkdown>
                        <CardFooter>
                            <ButtonOpenCard onClick={() => openEditModal(done.id, done.titulo, done.conteudo, done.lista)}>Editar</ButtonOpenCard>
                            <ButtonDeleteCard onClick={() => removeCard(done.id)}>Remover</ButtonDeleteCard>
                        </CardFooter>
                        <Modal isOpen={modalEditIsOpen} onRequestClose={closeEditModal} style={CreateNewCard}>
                            <ModalTitle>Alterar card</ModalTitle>
                            <ButtoncloseAddModal onClick={closeEditModal}>
                                <UilTimesSquare size="36" color="#E40049" />
                            </ButtoncloseAddModal>
                            <FormContent onSubmit={editCard}>
                                <InputForm type="hidden" value={done.id}  />
                                <LabelForm>Título:</LabelForm>
                                <InputForm type="text" value={titulo} onChange={(e) => setTitle(e.target.value)} />
                                <LabelForm>Conteúdo:</LabelForm>
                                <TextareaForm value={conteudo} onChange={(e) => setContent(e.target.value)} />
                                <LabelForm>Status:</LabelForm>
                                <SelectForm id="lista" value={lista} onChange={(event) => setList(event.target.value)}>
                                    <option value="todo">To-do</option>
                                    <option value="doing">Doing</option>
                                    <option value="done">Done</option>
                                </SelectForm>
                                <ButtonForm type="submit">Enviar</ButtonForm>
                                <ReactMarkdown>{conteudo}</ReactMarkdown>
                            </FormContent>
                        </Modal>
                    </Card> 
                ))}
            </ColumnDone>
        </BoardContent>
    );
};

// Botão
const ButtonCreateCard = styled.button`
    float: right;
    background: rgba(255, 255, 255, 0.25);
    font-size: 16px;
    color: #ffffff;
    display: block;
    margin: auto;
    cursor: pointer;
    padding: 8px 24px;
    border: none;
    border-radius: 5px;
`;

const CreateNewCard = {
    content: {
      top: '50%',
      left: '50%',
      width: '480px',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

const BoardContent = styled.div`
    width: 100%;
    background: rgba(255, 255, 255, 0.75);
    display: grid;
    margin: auto;
    grid-template-columns: 285px 285px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
    "BoardTop BoardTop BoardTop"
    "ColumnToDo ColumnDoing ColumnDone";
    height: 100vh;
`;

const BoardTop = styled.div`
    grid-area: BoardTop;
    background-color: #026AA7;
    padding: 15px;
`;

const BoardTitle = styled.h1`
    color: #FFFFFF;
    font-size: 18px;
    line-height: 36px;
    float: left;
    padding: 0;
    margin: 0;
`;

const ColumnToDo = styled.div`
    grid-area: ColumnToDo;
    width: 250px;
    padding: 10px;
    margin: 15px;
    border-radius: 8px;
    background-color: #EBECF0;
`;

const ColumnDoing = styled.div`
    grid-area: ColumnDoing;
    width: 250px;
    padding: 10px;
    margin: 15px;
    border-radius: 8px;
    background-color: #EBECF0;
`;

const ColumnDone = styled.div`
    grid-area: ColumnDone;
    width: 250px;
    padding: 10px;
    margin: 15px;
    border-radius: 8px;
    background-color: #EBECF0;
`;

// Titulo de Login
const ModalTitle = styled.h2`
    color: #0C1424;
    font-size: 18px;
    line-height:36px;
    float: left;
    width: 435px;
    margin:0;
    padding:0;
`;

const ButtoncloseAddModal = styled.button`
    float: right;
    border: none;
    background: none;
    cursor: pointer;
`;

// Titulo de Login
const FormContent = styled.form`
    margin: 60px 0 30px 0;
`;


// Label de Login
const LabelForm = styled.label`
    color: #484848;
    font-size: 18px;
    text-align: left;
    display: block;
    padding-bottom: 5px;
`;

// Input de Login
const InputForm = styled.input`
    color: #484848;
    font-size: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    width: calc(100% - 5px);
    height: 36px;
    margin-bottom: 15px;
`;

// Input de Login
const TextareaForm = styled.textarea`
    color: #484848;
    font-size: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    width: calc(100% - 5px);
    height: 150px;
    margin-bottom: 15px;
`;

// Input de Login
const SelectForm = styled.select`
    color: #484848;
    font-size: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    width: 100%;
    height: 36px;
    margin-bottom: 15px;
`;

// Botão de Login
const ButtonForm = styled.button`
    background-color: #2D4476;
    font-size: 18px;
    font-family: 'Tilt Warp', cursive;
    color: #f1f1f1;
    display: block;
    margin: auto;
    cursor: pointer;
    margin-top: 20px;
    padding: 8px 0px;
    width: 100%;
    border: none;
    border-radius: 5px;
`;

const Card = styled.div`
    background-color: #ffffff;
    margin-top: 10px;
    padding:15px;
    width: 220px;
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.12);
`;

const HeaderColumn = styled.h2`
    color: #000000;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height:24px;
    margin:0;
    padding:0;
    margin-bottom:15px;
`;

const CardTitle = styled.h3`
    color: #0C1424;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    line-height:20px;
    margin:0;
    padding:0;
`;

const CardFooter = styled.div`
    display: flex;
    margin-top: 20px;
`;

const ButtonOpenCard = styled.button`
    background-color: rgb(2, 106, 167);
    font-size: 12px;
    font-family: 'Open Sans', sans-serif;
    color: #f1f1f1;
    display: block;
    margin: auto;
    cursor: pointer;
    padding: 8px 0px;
    width: 45%;
    border: none;
    border-radius: 5px;
`;

const ButtonDeleteCard = styled.button`
    background-color: red;
    font-size: 12px;
    font-family: 'Open Sans', sans-serif;
    color: #f1f1f1;
    display: block;
    margin: auto;
    cursor: pointer;
    padding: 8px 0px;
    width: 45%;
    border: none;
    border-radius: 5px;
`;

export default Board;