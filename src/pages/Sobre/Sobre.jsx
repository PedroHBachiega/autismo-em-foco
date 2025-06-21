import React, { useEffect, useState } from 'react'
import styles from './Sobre.module.css'
import ReadInstructions from '../../components/ReadInstructions/ReadInstructions'

import grupoApoioImg from '../../assets/grupo-apoio.jpg';
import pedroSouzaImg from '../../assets/pedrosouza.png';
import igorImg from '../../assets/igor.png';
import matheusImg from '../../assets/matheus.png';
import geysaImg from '../../assets/geysa.png';
import pedroBachiegaImg from '../../assets/pedrobachiega.png';
import pedroScabeloImg from '../../assets/pedroscabelo.png';
import vitorImg from '../../assets/vitor.png';

const Sobre = () => {
  const [missao, setMissao] = useState([]);
  const [valores, setValores] = useState([]);
  const [equipe, setEquipe] = useState([]);

  useEffect(() => {
    const dadosMissao = [
      "O Autismo em Foco nasceu da necessidade de criar um espaço de apoio, informação e conexão para famílias e pessoas com Transtorno do Espectro Autista (TEA). Nosso objetivo é proporcionar recursos de qualidade, promover a inclusão e contribuir para uma sociedade mais consciente e acolhedora."
    ];

    const dadosValores = [
      { 
        titulo: 'Respeito',
        texto: 'Valorizamos a neurodiversidade e respeitamos as características individuais de cada pessoa.'
      },
      {
        titulo: 'Inclusão',
        texto: 'Trabalhamos para promover uma sociedade inclusiva, onde todos possam participar plenamente.'
      },
      {
        titulo: 'Informação',
        texto: 'Compartilhamos conhecimento baseado em evidências científicas e experiências reais.'
      },
      {
        titulo: 'Comunidade',
        texto: 'Acreditamos no poder da conexão e do apoio mútuo entre famílias e profissionais.'
      }
    ];


    const dadosEquipe = [
      {nome: 'Pedro H. A. Souza', imagem: pedroSouzaImg},
      {nome: 'Igor Ferreira da Silva', imagem: igorImg},
      {nome: 'Matheus Tamine Benedito', imagem: matheusImg},
      {nome: 'Geysa Ribeiro Toppan', imagem: geysaImg},
      {nome: 'Pedro H. Bachiega', imagem: pedroBachiegaImg},
      {nome: 'Pedro H. Scabelo', imagem: pedroScabeloImg},
      {nome: 'Vitor H. B. Z. Silva', imagem: vitorImg},
    
    ];

    setMissao(dadosMissao);
    setValores(dadosValores);
    setEquipe(dadosEquipe);
  }, []);

  return (
    <div className={styles.sobreContainer}>
      <section className={styles.header}>
        <h1>Sobre o Autismo em Foco</h1>
        <p>Conheça nossa missão e equipe</p>
        {/* Adicionando o componente de leitura */}
        <ReadInstructions contentSelector=".sobreContainer" title="esta página" />
      </section>

      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <h2>Nossa Missão</h2>
          {missao.map((item,index) => (
              <p key={index}>{item}</p>
          )) }
        </div>

        <div className={styles.missionImage}>
          <img src={grupoApoioImg} alt="Mãos dadas em círculo" className={styles.imgApoio}/>
        </div>
      </section>

      <section className={styles.values}>
        <h2>Nossos Valores</h2>
        <div className={styles.valuesList}>
          {valores.map((valor,index) => (
          <div className={styles.valueItem} key={index}>
            <h3>{valor.titulo}</h3>
            <p>{valor.texto}</p>
          </div>
          ))} 
          </div>
          </section>

      <section className={styles.team}>
        <h2>Nossa Equipe</h2>
        <div className={styles.teamMembers}>
          {equipe.map((membro, index) => (
          <div className={styles.teamMember} key={index}>
            <div className={styles.memberPhoto}>
              <img src={membro.imagem} alt={membro.nome} className={styles.membrosEquipe} />
            </div>
            <h3>{membro.nome}</h3>
              <p>Estudante da Fatec Matão-Luiz Marchesan</p>
          </div>
          ))}
          </div>
          </section>

      <section className={styles.contact}>
        <h2>Entre em Contato</h2>
        <p>Estamos à disposição para esclarecer dúvidas e receber sugestões.</p>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <h3>Email</h3>
            <p>contato@autismoemfoco.com.br</p>
          </div>
          <div className={styles.contactItem}>
            <h3>Telefone</h3>
            <p>(11) 9999-9999</p>
          </div>
          <div className={styles.contactItem}>
            <h3>Redes Sociais</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>YouTube</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre