import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialSchema1748000000000 implements MigrationInterface {
  name = "InitialSchema1748000000000"

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        titulo VARCHAR NOT NULL,
        descricao TEXT NOT NULL,
        imagem VARCHAR NOT NULL,
        tecnologias TEXT NOT NULL,
        github VARCHAR,
        demo VARCHAR,
        categoria VARCHAR NOT NULL,
        categorias TEXT NOT NULL,
        data VARCHAR NOT NULL,
        testavel BOOLEAN NOT NULL DEFAULT false,
        request_slug VARCHAR UNIQUE,
        docs_url VARCHAR,
        active BOOLEAN NOT NULL DEFAULT true,
        allow_display BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        nome VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        motivo TEXT,
        status VARCHAR NOT NULL DEFAULT 'PENDING',
        token VARCHAR UNIQUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = now(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `)

    await queryRunner.query(`
      CREATE TRIGGER projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `)

    await queryRunner.query(`
      CREATE TRIGGER access_requests_updated_at
      BEFORE UPDATE ON access_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS access_requests`)
    await queryRunner.query(`DROP TABLE IF EXISTS projects`)
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at`)
  }
}
