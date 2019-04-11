page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :url_root, ENV.fetch('BASE_URL')

ignore '/templates/*'

langs = ENV.fetch('LANGS').split(",").map(&:to_sym)
activate :i18n, langs: langs, mount_at_root: false

activate :asset_hash
activate :directory_indexes
activate :pagination
activate :inline_svg
activate :dato, token: ENV.fetch('DATO_API_TOKEN'), live_reload: true

webpack_command =
  if build?
    "yarn run build"
  else
    "yarn run dev"
  end

activate :external_pipeline,
  name: :webpack,
  command: webpack_command,
  source: ".tmp/dist",
  latency: 1

configure :build do
  activate :minify_html do |html|
    html.remove_input_attributes = false
  end
  activate :search_engine_sitemap,
    default_priority: 0.5,
    default_change_frequency: 'weekly'
end

configure :development do
  activate :livereload
end

require "lib/menu_helpers"
helpers MenuHelpers

helpers do
  def active?(url)
    (url === "/#{I18n.locale}/" && current_page.url === "/#{I18n.locale}/") ||
      (url != "/#{I18n.locale}/" && current_page.url[0...-1].eql?(url)) ||
      url == current_page.url
  end

  def active_link_to(name, url, options = {})
    options[:class] = options.fetch(:class, "") + " is-active" if active?(url)
    link_to name, url, options
  end

  def localized_paths_for(page)
    localized_paths = {}
    sitemap.resources.each do |resource|
      next if !resource.is_a?(Middleman::Sitemap::ProxyResource)
      unless current_page.path == "404.html" || current_page.path == "index.html"
        if resource.target_resource == page.target_resource && resource.metadata[:locals] == page.metadata[:locals]
          localized_paths[resource.metadata[:options][:locale]] = resource.url
        end
      end
    end
    localized_paths
  end

  def favicon_json_path(path, escape = '\/')
    image_path(path).gsub(/\//, escape)
  end

  # attributes = {class: "", id: "", data: {role: {}, title: {}}}
  def icon(name, attributes = {})
    default_attributes = {role: "icon"}
    default_attributes.merge!(attributes.except(:role))
    if attributes.key?(:class)
      default_attributes[:class] += " icon-svg--#{name}"
    else
      default_attributes[:class] ||= "icon-svg--#{name}"
    end

    content_tag(:svg, default_attributes) do
      content_tag(:use, "", "xlink:href" => "##{name}")
    end
  end
  alias_method :i, :icon

  # Custom helper to theme
  def site_nav_menu
    [
      dato.about_page,
      MenuHelpers::CustomMenu.new(I18n.t('nav.services'), "#", dato.service_pages),
      MenuHelpers::CustomMenu.new(I18n.t('nav.advanced_solutions'), "#", dato.advanced_solution_pages),
      MenuHelpers::CustomMenu.new(I18n.t('nav.network'), "#", []),
      dato.careers_page,
      dato.collection_news_page
      # dato.contact_page
    ]
  end
end

dato.tap do |dato|
  langs.each do |locale|
    I18n.with_locale(locale) do
      proxy "/#{locale}/index.html",
        "/localizable/index.html",
        locals: { page: dato.homepage },
        locale: locale

      proxy "/#{locale}/#{dato.about_page.slug}/index.html",
        "/templates/about_page.html",
        locals: { page: dato.about_page },
        locale: locale

      proxy "/#{locale}/#{dato.careers_page.slug}/index.html",
        "/templates/careers_page.html",
        locals: { page: dato.careers_page },
        locale: locale

      proxy "/#{locale}/#{dato.awards_page.slug}/index.html",
        "/templates/awards_page.html",
        locals: { page: dato.awards_page },
        locale: locale

      proxy "/#{locale}/#{dato.certification_page.slug}/index.html",
        "/templates/certification_page.html",
        locals: { page: dato.certification_page },
        locale: locale

      proxy "/#{locale}/#{dato.collaboration_page.slug}/index.html",
        "/templates/collaboration_page.html",
        locals: { page: dato.collaboration_page },
        locale: locale

      proxy "/#{locale}/#{dato.ethical_code_page.slug}/index.html",
        "/templates/ethical_code_page.html",
        locals: { page: dato.ethical_code_page },
        locale: locale

      dato.advanced_solution_pages.each do |advanced_solution|
        I18n.locale = locale
        proxy "/#{locale}/cargo-solutions/#{advanced_solution.slug}/index.html",
          "/templates/advanced_solution_page.html",
          locals: { page: advanced_solution },
          locale: locale
      end

      dato.service_pages.each do |service|
        I18n.locale = locale
        proxy "/#{locale}/services/#{service.slug}/index.html",
          "/templates/service_page.html",
          locals: { page: service },
          locale: locale
      end

      proxy "/#{locale}/#{dato.collection_news_page.slug}/index.html",
        "/templates/collection_news_page.html",
        locals: {
          page: dato.collection_news_page,
          news_pages: dato.news_pages
        },
        locale: locale

      dato.news_pages.each do |news|
        I18n.locale = locale
        proxy "/#{locale}/#{dato.collection_news_page.slug}/#{news.slug}/index.html",
          "/templates/news_page.html",
          locals: { page: news },
          locale: locale
      end
    end
  end
end

proxy "site.webmanifest",
  "templates/site.webmanifest",
  :layout => false

proxy "browserconfig.xml",
  "templates/browserconfig.xml",
  :layout => false

proxy "/_redirects",
  "/templates/redirects.txt",
  :layout => false
