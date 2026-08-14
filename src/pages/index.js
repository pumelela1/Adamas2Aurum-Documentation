import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Adamas2Aurum Documentation"
      description="Official project documentation for Adamas2Aurum"
    >
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>PROJECT DOCUMENTATION</p>

            <h1>Adamas2Aurum</h1>

            <p className={styles.subtitle}>
              A complete record of our project's planning, design,
              implementation, testing and deployment.
            </p>

            <p className={styles.period}>
              02 August 2026 — 23 October 2026
            </p>

            <Link
              className={styles.primaryButton}
              to="/docs/introduction"
            >
              Explore Documentation
            </Link>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>PROJECT RECORD</p>

            <h2>Everything in one place</h2>

            <p>
              This documentation provides a structured record of the
              Adamas2Aurum project, from initial planning and requirements
              through to implementation, testing and deployment.
            </p>
          </div>

          <div className={styles.cards}>

            <Link
              className={styles.card}
              to="/docs/project-overview/overview"
            >
              <span className={styles.cardNumber}>01</span>
              <h3>Project Overview</h3>
              <p>
                Discover the project's goals, features, scope and
                technology stack.
              </p>
            </Link>

            <Link
              className={styles.card}
              to="/docs/project-management/overview"
            >
              <span className={styles.cardNumber}>02</span>
              <h3>Project Management</h3>
              <p>
                Explore the project plan, backlog, sprints, burndown
                charts and meeting records.
              </p>
            </Link>

            <Link
              className={styles.card}
              to="/docs/design/requirements"
            >
              <span className={styles.cardNumber}>03</span>
              <h3>Requirements & Design</h3>
              <p>
                View requirements, user stories, design documents and
                architecture.
              </p>
            </Link>

            <Link
              className={styles.card}
              to="/docs/implementation/overview"
            >
              <span className={styles.cardNumber}>04</span>
              <h3>Implementation</h3>
              <p>
                Documentation of the frontend, backend, authentication,
                database and game systems.
              </p>
            </Link>

            <Link
              className={styles.card}
              to="/docs/testing/test-plan"
            >
              <span className={styles.cardNumber}>05</span>
              <h3>Testing</h3>
              <p>
                Test planning, test cases and results throughout the
                development process.
              </p>
            </Link>

            <Link
              className={styles.card}
              to="/docs/deployment/overview"
            >
              <span className={styles.cardNumber}>06</span>
              <h3>Deployment</h3>
              <p>
                Hosting, deployment architecture, configuration and
                troubleshooting.
              </p>
            </Link>

          </div>
        </section>
      </main>
    </Layout>
  );
}