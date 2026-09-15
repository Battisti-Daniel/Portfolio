package com.danielbattisti.portfolio.config;

import com.danielbattisti.portfolio.model.BlogPost;
import com.danielbattisti.portfolio.model.Plan;
import com.danielbattisti.portfolio.model.PlanStatus;
import com.danielbattisti.portfolio.model.Profile;
import com.danielbattisti.portfolio.model.Project;
import com.danielbattisti.portfolio.model.User;
import com.danielbattisti.portfolio.repository.BlogPostRepository;
import com.danielbattisti.portfolio.repository.PlanRepository;
import com.danielbattisti.portfolio.repository.ProfileRepository;
import com.danielbattisti.portfolio.repository.ProjectRepository;
import com.danielbattisti.portfolio.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final PlanRepository planRepository;
    private final BlogPostRepository blogPostRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    public DataSeeder(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            ProjectRepository projectRepository,
            PlanRepository planRepository,
            BlogPostRepository blogPostRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.projectRepository = projectRepository;
        this.planRepository = planRepository;
        this.blogPostRepository = blogPostRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedProfile();
        seedProjects();
        seedPlans();
        seedBlogPosts();
    }

    private void seedAdminUser() {
        if (userRepository.findByUsername(adminUsername).isPresent()) {
            return;
        }
        User admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .role("ADMIN")
                .build();
        userRepository.save(admin);
        log.info("Usuário admin '{}' criado. Troque a senha padrão em produção!", adminUsername);
    }

    private void seedProfile() {
        if (profileRepository.count() > 0) {
            return;
        }
        Profile profile = Profile.builder()
                .name("Seu Nome")
                .title("Desenvolvedor(a) Full Stack")
                .bio("Escreva aqui uma breve apresentação sobre você: sua trajetória, "
                        + "o que você gosta de construir e as tecnologias com as quais mais gosta de trabalhar. "
                        + "Edite este texto pelo painel administrativo em /admin.")
                .email("seu.email@example.com")
                .location("Sua Cidade, Brasil")
                .avatarUrl(null)
                .githubUrl("https://github.com/seu-usuario")
                .linkedinUrl("https://linkedin.com/in/seu-usuario")
                .xUrl(null)
                .updatedAt(Instant.now())
                .build();
        profileRepository.save(profile);
    }

    private void seedProjects() {
        if (projectRepository.count() > 0) {
            return;
        }
        projectRepository.saveAll(List.of(
                Project.builder()
                        .title("Plataforma de E-commerce")
                        .description("Aplicação full stack de e-commerce com catálogo de produtos, carrinho de "
                                + "compras e checkout. Exemplo de projeto — edite ou remova pelo painel /admin.")
                        .techStack(List.of("Angular", "Spring Boot", "PostgreSQL"))
                        .repoUrl("https://github.com/seu-usuario/exemplo-ecommerce")
                        .demoUrl(null)
                        .featured(true)
                        .displayOrder(1)
                        .build(),
                Project.builder()
                        .title("App de Gestão de Tarefas")
                        .description("Aplicativo para organização de tarefas pessoais com quadros no estilo "
                                + "kanban. Exemplo de projeto — edite ou remova pelo painel /admin.")
                        .techStack(List.of("Angular", "Spring Boot", "JWT"))
                        .repoUrl("https://github.com/seu-usuario/exemplo-tarefas")
                        .demoUrl(null)
                        .featured(true)
                        .displayOrder(2)
                        .build(),
                Project.builder()
                        .title("API de Encurtador de URLs")
                        .description("API REST para encurtar e rastrear cliques em links. "
                                + "Exemplo de projeto — edite ou remova pelo painel /admin.")
                        .techStack(List.of("Spring Boot", "PostgreSQL", "Docker"))
                        .repoUrl("https://github.com/seu-usuario/exemplo-url-shortener")
                        .demoUrl(null)
                        .featured(false)
                        .displayOrder(3)
                        .build()));
    }

    private void seedPlans() {
        if (planRepository.count() > 0) {
            return;
        }
        planRepository.saveAll(List.of(
                Plan.builder()
                        .title("Aprender uma nova tecnologia")
                        .description("Descreva aqui uma tecnologia, framework ou área que você quer estudar em "
                                + "seguida. Edite pelo painel /admin.")
                        .status(PlanStatus.IN_PROGRESS)
                        .targetDate(LocalDate.now().plusMonths(2))
                        .displayOrder(1)
                        .build(),
                Plan.builder()
                        .title("Contribuir com um projeto open source")
                        .description("Um objetivo de médio prazo. Edite pelo painel /admin.")
                        .status(PlanStatus.PLANNED)
                        .targetDate(LocalDate.now().plusMonths(4))
                        .displayOrder(2)
                        .build(),
                Plan.builder()
                        .title("Publicar este portfólio")
                        .description("Colocar o site no ar e compartilhar com a comunidade.")
                        .status(PlanStatus.DONE)
                        .targetDate(LocalDate.now())
                        .displayOrder(3)
                        .build()));
    }

    private void seedBlogPosts() {
        if (blogPostRepository.count() > 0) {
            return;
        }
        BlogPost post = BlogPost.builder()
                .title("Bem-vindo ao meu blog")
                .slug("bem-vindo-ao-meu-blog")
                .summary("Este é o primeiro post do blog — um exemplo de como o conteúdo aparece no site.")
                .content("## Olá!\n\n"
                        + "Este é um post de exemplo criado automaticamente. Você pode editá-lo ou excluí-lo "
                        + "pelo painel administrativo em `/admin`, e criar novos posts em Markdown por lá.\n\n"
                        + "Use este espaço para compartilhar aprendizados, novidades sobre seus projetos ou "
                        + "reflexões sobre tecnologia.")
                .tags(List.of("bem-vindo", "blog"))
                .published(true)
                .publishedAt(Instant.now())
                .build();
        blogPostRepository.save(post);
    }
}
