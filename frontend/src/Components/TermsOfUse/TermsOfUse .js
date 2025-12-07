import React from "react";
import styles from "./TermsOfUse.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { LanguageContext } from "../../Context/LanguageContext";

const TermsOfUse = () => {
  const { language } = React.useContext(LanguageContext);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {language === "pt" ? (
            <>
              <h1 className={styles.title}>
                Termos de Uso e Política de Privacidade
              </h1>
              <p className={styles.text}>
                A ListVideo valoriza a privacidade de seus usuários e tem como
                compromisso proteger suas informações pessoais. Neste documento,
                explicamos de forma transparente como nossa Plataforma funciona.
              </p>
              <ol className={styles.list}>
                <li>
                  <strong>Coleta de Dados:</strong> Coletamos informações
                  pessoais, incluindo seu nome de usuário e detalhes de login,
                  para fornecer uma experiência segura e personalizada em nossa
                  plataforma. Todas as informações sensíveis são criptografadas
                  para garantir a proteção adicional.
                </li>
                <li>
                  <strong>Uso de Dados:</strong> Utilizamos seu nome de usuário
                  apenas para emissão de certificados e não compartilhamos ou
                  vendemos suas informações a terceiros.
                </li>
              </ol>
              <p>
                Ao utilizar o site <strong>https://www.listvideo.app/</strong>,
                você concorda com os seguintes termos de uso:
              </p>
              <ol className={styles.list}>
                <li>
                  <strong>Conteúdo das Playlists:</strong> Não somos
                  responsáveis pelo conteúdo das playlists exibidas em nossa
                  plataforma, os quais são de responsabilidade do autor da
                  playlist e estão sujeitas aos termos de uso do próprio
                  YouTube.
                </li>
                <li>
                  <strong>Revogação de Acesso:</strong> Reservamos o direito de
                  revogar o acesso de qualquer usuário à nossa plataforma a
                  nosso critério exclusivo.
                </li>
                <li>
                  <strong>Disponibilidade Gratuita:</strong> Nossa solução é
                  gratuita e seu custo online não é transferido para o usuário.
                  Portanto, a disponibilidade e funcionamento da plataforma
                  podem ser encerrados sem aviso prévio.
                </li>
                <li>
                  <strong>Uso da YouTube Data API:</strong> A ListVideo segue os
                  termos de uso do YouTube e todos os dados dos vídeos e seus
                  criadores são obtidos através da YouTube Data API.
                </li>
                <li>
                  <strong>Certificados:</strong> Os certificados emitidos pela
                  ListVideo não são reconhecidos necessariamente pelo criador de
                  conteúdo da playlist e não são “assinados” por eles.
                </li>
                <li>
                  <strong>
                    Alterações à Política de Privacidade e Termos de Uso:
                  </strong>{" "}
                  Reservamos o direito de atualizar esta política de privacidade
                  e os Termos de Uso a qualquer momento.
                </li>
              </ol>
              <p>
                <strong>Última atualização: Fevereiro/2023</strong>
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Terms of Use and Privacy Policy</h1>
              <p className={styles.text}>
                ListVideo values the privacy of its users and has the commitment
                to protect your personal information. In this document, we
                transparently explain how our Platform works.
              </p>
              <ol className={styles.list}>
                <li>
                  <strong>Data Collection:</strong> We collect information
                  personal data, including your username and login details, to
                  provide a safe and personalized experience on our platform.
                  All sensitive information is encrypted to provide additional
                  protection.
                </li>
                <li>
                  <strong>Use of Data:</strong> We use your username for issuing
                  certificates only and we do not share or we sell your
                  information to third parties.
                </li>
              </ol>
              <p>
                By using the website <strong>https://www.listvideo.app/</strong>
                , you agree to the following terms of use:
              </p>
              <ol className={styles.list}>
                <li>
                  <strong>Playlist Content:</strong> We are not responsible for
                  the content of the playlists displayed on our platform, which
                  are the responsibility of the author of the playlist and are
                  subject to the terms of use of the own YouTube.
                </li>
                <li>
                  <strong>Revocation of Access:</strong> We reserve the right to
                  revoke any user's access to our platform to our sole
                  discretion.
                </li>
                <li>
                  <strong>Free Availability:</strong> Our solution is free and
                  its online cost is not passed on to the user. Therefore, the
                  availability and operation of the platform may be terminated
                  without notice.
                </li>
                <li>
                  <strong>YouTube Data API Usage:</strong> ListVideo follows the
                  terms of use of YouTube and all data of the videos and their
                  creators are obtained through the YouTube Data API.
                </li>
                <li>
                  <strong>Certificates:</strong> The certificates issued by
                  ListVideo are not necessarily recognized by the creator of
                  playlist content and are not “signed” by them.
                </li>
                <li>
                  <strong>
                    Changes to the Privacy Policy and Terms of Use:
                  </strong>
                  We reserve the right to update this privacy policy. and the
                  Terms of Use at any time.
                </li>
              </ol>
              <p>
                <strong>Last update: February/2023</strong>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfUse;
