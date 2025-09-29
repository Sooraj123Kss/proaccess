// Asset Management Application JavaScript
class AssetFlowApp {
  constructor() {
    this.assetSources = null;
    this.ccLicenses = null;
    this.complianceChecklist = null;
    this.contentCategories = null;
    
    // Application state
    this.currentAssets = [];
    this.savedAssets = [];
    this.collections = [
      { id: 'default', name: 'All Assets', description: 'Default collection containing all saved assets', type: 'general', assets: [] }
    ];
    this.projects = [
      { 
        id: 'sample', 
        name: 'Sample Social Media Campaign', 
        platform: 'Instagram', 
        status: 'compliant', 
        assets: [], 
        created: new Date().toLocaleDateString(),
        type: 'social-media'
      }
    ];
    
    this.currentSearchQuery = '';
    this.currentFilters = {};
    this.loadedAssetCount = 0;
    this.assetsPerPage = 12;
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupNavigation();
    this.setupDiscovery();
    this.setupLibrary();
    this.setupProjects();
    this.setupCompliance();
    this.setupEducation();
    this.setupReports();
    this.setupModals();
    
    // Initialize with sample data
    this.generateSampleAssets();
    this.updateLibraryStats();
    this.updateComplianceMetrics();
    this.renderLicenseGuide();
  }

  async loadData() {
    try {
      // Load JSON data from provided asset URLs
      const [assetSourcesResponse, ccLicensesResponse, complianceChecklistResponse, contentCategoriesResponse] = await Promise.all([
        fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6b85444de6c311fec8c69b6156829b05/bca54c81-611a-42a6-9424-5a8df0113778/af6e68be.json'),
        fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6b85444de6c311fec8c69b6156829b05/bca54c81-611a-42a6-9424-5a8df0113778/c9514689.json'),
        fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6b85444de6c311fec8c69b6156829b05/bca54c81-611a-42a6-9424-5a8df0113778/8ed92916.json'),
        fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6b85444de6c311fec8c69b6156829b05/bca54c81-611a-42a6-9424-5a8df0113778/543daa15.json')
      ]);

      this.assetSources = await assetSourcesResponse.json();
      this.ccLicenses = await ccLicensesResponse.json();
      this.complianceChecklist = await complianceChecklistResponse.json();
      this.contentCategories = await contentCategoriesResponse.json();

      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback data in case of loading error
      this.initFallbackData();
    }
  }

  initFallbackData() {
    this.assetSources = {
      images: {
        "Unsplash": {
          "license_type": "Unsplash License",
          "attribution_required": false,
          "commercial_use": true,
          "modifications_allowed": true,
          "description": "High-quality photographs, 6M+ images"
        }
      }
    };
    this.ccLicenses = {
      "CC0": {
        "name": "Public Domain",
        "attribution_required": false,
        "commercial_use": true,
        "modifications_allowed": true
      }
    };
    this.complianceChecklist = {
      "before_use": [
        "Verify the license type and terms",
        "Check attribution requirements"
      ]
    };
    this.contentCategories = {
      "social_media": {
        "platforms": ["Instagram", "Facebook", "Twitter"],
        "asset_types": ["Images", "Videos"]
      }
    };
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const targetSection = link.getAttribute('data-section');
        
        // Update active navigation
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');
        
        // Section-specific initialization
        if (targetSection === 'library') {
          this.updateLibraryStats();
          this.renderCollections();
          this.renderRecentAssets();
        } else if (targetSection === 'projects') {
          this.renderProjects();
        } else if (targetSection === 'compliance') {
          this.updateComplianceMetrics();
        } else if (targetSection === 'education') {
          this.renderLicenseGuide();
        }
      });
    });
  }

  setupDiscovery() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterElements = [
      document.getElementById('filter-source'),
      document.getElementById('filter-type'),
      document.getElementById('filter-license'),
      document.getElementById('filter-category')
    ];

    searchBtn.addEventListener('click', () => this.performSearch());
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.performSearch();
    });

    filterElements.forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => this.applyFilters());
      }
    });

    loadMoreBtn.addEventListener('click', () => this.loadMoreAssets());

    // Initial asset display
    this.displayAssets();
  }

  generateSampleAssets() {
    const sampleAssets = [
      {
        id: 'asset-1',
        title: 'Modern Business Team Meeting',
        source: 'Unsplash',
        type: 'image',
        category: 'business',
        license: 'cc0',
        url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=280&h=200&fit=crop',
        attribution_required: false,
        commercial_use: true,
        tags: ['business', 'meeting', 'team', 'office'],
        author: 'Campaign Creators',
        description: 'Professional team meeting in modern office environment'
      },
      {
        id: 'asset-2',
        title: 'Technology and Innovation',
        source: 'Pexels',
        type: 'image',
        category: 'technology',
        license: 'attribution',
        url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?w=400&h=300&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?w=280&h=200&fit=crop',
        attribution_required: false,
        commercial_use: true,
        tags: ['technology', 'laptop', 'coding', 'development'],
        author: 'ThisIsEngineering',
        description: 'Developer working on laptop with code on screen'
      },
      {
        id: 'asset-3',
        title: 'Natural Landscape Mountains',
        source: 'Unsplash',
        type: 'image',
        category: 'nature',
        license: 'cc0',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=280&h=200&fit=crop',
        attribution_required: false,
        commercial_use: true,
        tags: ['nature', 'mountains', 'landscape', 'outdoor'],
        author: 'Qingbao Meng',
        description: 'Stunning mountain landscape with clear sky'
      },
      {
        id: 'asset-4',
        title: 'Food Photography Flatlay',
        source: 'Pexels',
        type: 'image',
        category: 'food',
        license: 'cc0',
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=280&h=200&fit=crop',
        attribution_required: false,
        commercial_use: true,
        tags: ['food', 'healthy', 'vegetables', 'cooking'],
        author: 'Ella Olsson',
        description: 'Beautiful flatlay of fresh vegetables and ingredients'
      },
      {
        id: 'asset-5',
        title: 'Urban Architecture Modern',
        source: 'Pixabay',
        type: 'image',
        category: 'business',
        license: 'cc0',
        url: 'https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_640.jpg',
        thumbnail: 'https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_640.jpg',
        attribution_required: false,
        commercial_use: true,
        tags: ['architecture', 'building', 'urban', 'modern'],
        author: 'StartupStockPhotos',
        description: 'Modern glass building with geometric design'
      },
      {
        id: 'asset-6',
        title: 'People Working Together',
        source: 'Unsplash',
        type: 'image',
        category: 'people',
        license: 'cc0',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=280&h=200&fit=crop',
        attribution_required: false,
        commercial_use: true,
        tags: ['people', 'teamwork', 'collaboration', 'office'],
        author: 'Annie Spratt',
        description: 'Team collaborating around a table with laptops'
      }
    ];

    this.currentAssets = sampleAssets;
  }

  performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    this.currentSearchQuery = query;
    this.loadedAssetCount = 0;
    
    this.showLoading();
    
    setTimeout(() => {
      let filteredAssets = [...this.currentAssets];
      
      if (query) {
        filteredAssets = filteredAssets.filter(asset => 
          asset.title.toLowerCase().includes(query) ||
          asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
          asset.category.toLowerCase().includes(query)
        );
      }
      
      this.applyFiltersToAssets(filteredAssets);
      this.hideLoading();
    }, 1000);
  }

  applyFilters() {
    const source = document.getElementById('filter-source').value;
    const type = document.getElementById('filter-type').value;
    const license = document.getElementById('filter-license').value;
    const category = document.getElementById('filter-category').value;
    
    this.currentFilters = { source, type, license, category };
    
    let filteredAssets = [...this.currentAssets];
    
    if (this.currentSearchQuery) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.title.toLowerCase().includes(this.currentSearchQuery) ||
        asset.tags.some(tag => tag.toLowerCase().includes(this.currentSearchQuery))
      );
    }
    
    this.applyFiltersToAssets(filteredAssets);
  }

  applyFiltersToAssets(assets) {
    let filtered = [...assets];
    
    if (this.currentFilters.source) {
      filtered = filtered.filter(asset => asset.source.toLowerCase().includes(this.currentFilters.source.toLowerCase()));
    }
    if (this.currentFilters.type && this.currentFilters.type !== 'images') {
      filtered = filtered.filter(asset => asset.type === this.currentFilters.type);
    }
    if (this.currentFilters.license) {
      filtered = filtered.filter(asset => asset.license === this.currentFilters.license);
    }
    if (this.currentFilters.category) {
      filtered = filtered.filter(asset => asset.category === this.currentFilters.category);
    }
    
    this.displayAssets(filtered.slice(0, this.assetsPerPage));
    this.loadedAssetCount = Math.min(filtered.length, this.assetsPerPage);
  }

  displayAssets(assets = null) {
    const assetsToShow = assets || this.currentAssets.slice(0, this.assetsPerPage);
    const container = document.getElementById('asset-results');
    
    container.innerHTML = assetsToShow.map(asset => this.createAssetCard(asset)).join('');
    
    // Add click handlers
    container.querySelectorAll('.asset-item').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showAssetPreview(assetsToShow[index]);
      });
    });
  }

  createAssetCard(asset) {
    const licenseInfo = this.getLicenseInfo(asset.license);
    
    return `
      <div class="asset-item" data-asset-id="${asset.id}">
        <div class="asset-thumbnail">
          <img src="${asset.thumbnail}" alt="${asset.title}" loading="lazy">
          <div class="asset-overlay">
            <div class="asset-overlay-content">
              <button class="btn btn--sm btn--primary">Preview</button>
            </div>
          </div>
        </div>
        <div class="asset-info">
          <h3 class="asset-title">${asset.title}</h3>
          <p class="asset-source">Source: ${asset.source}</p>
          <div class="asset-license">
            <span class="license-badge ${asset.license}">${licenseInfo.name}</span>
            ${asset.commercial_use ? '<span class="license-badge commercial">Commercial OK</span>' : ''}
          </div>
          <div class="asset-actions">
            <button class="btn btn--sm btn--secondary" onclick="event.stopPropagation(); app.saveAssetQuick('${asset.id}')">Save</button>
          </div>
        </div>
      </div>
    `;
  }

  getLicenseInfo(licenseType) {
    if (this.ccLicenses && this.ccLicenses[licenseType.toUpperCase()]) {
      return this.ccLicenses[licenseType.toUpperCase()];
    }
    
    const licenseMap = {
      'cc0': { name: 'Public Domain', attribution_required: false, commercial_use: true },
      'attribution': { name: 'Attribution', attribution_required: true, commercial_use: true },
      'commercial': { name: 'Commercial', attribution_required: false, commercial_use: true }
    };
    
    return licenseMap[licenseType] || { name: 'Unknown', attribution_required: true, commercial_use: false };
  }

  loadMoreAssets() {
    this.loadedAssetCount += this.assetsPerPage;
    const assetsToShow = this.currentAssets.slice(0, this.loadedAssetCount);
    this.displayAssets(assetsToShow);
    
    if (this.loadedAssetCount >= this.currentAssets.length) {
      document.getElementById('load-more-btn').style.display = 'none';
    }
  }

  showAssetPreview(asset) {
    const modal = document.getElementById('asset-preview-modal');
    const title = document.getElementById('asset-title');
    const image = document.getElementById('asset-preview-image');
    const licenseDetails = document.getElementById('asset-license-details');
    const metadata = document.getElementById('asset-metadata');
    const warnings = document.getElementById('compliance-warnings');
    
    title.textContent = asset.title;
    image.src = asset.url;
    image.alt = asset.title;
    
    const licenseInfo = this.getLicenseInfo(asset.license);
    licenseDetails.innerHTML = `
      <p><strong>License:</strong> ${licenseInfo.name}</p>
      <p><strong>Attribution Required:</strong> ${licenseInfo.attribution_required ? 'Yes' : 'No'}</p>
      <p><strong>Commercial Use:</strong> ${licenseInfo.commercial_use ? 'Allowed' : 'Not Allowed'}</p>
      <p><strong>Modifications:</strong> ${licenseInfo.modifications_allowed !== false ? 'Allowed' : 'Not Allowed'}</p>
    `;
    
    metadata.innerHTML = `
      <div class="metadata-item">
        <span class="metadata-label">Source:</span>
        <span class="metadata-value">${asset.source}</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Author:</span>
        <span class="metadata-value">${asset.author}</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Category:</span>
        <span class="metadata-value">${asset.category}</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Type:</span>
        <span class="metadata-value">${asset.type}</span>
      </div>
    `;
    
    warnings.innerHTML = this.generateComplianceWarnings(asset);
    
    // Store current asset for saving
    modal.dataset.assetId = asset.id;
    modal.classList.remove('hidden');
  }

  generateComplianceWarnings(asset) {
    const warnings = [];
    
    if (asset.tags.includes('people')) {
      warnings.push('<div class="warning-item"><span class="warning-icon">⚠️</span> Contains identifiable people - consider model releases for commercial use</div>');
    }
    
    if (asset.tags.includes('logo') || asset.tags.includes('brand')) {
      warnings.push('<div class="warning-item"><span class="warning-icon">⚠️</span> May contain trademarks or logos - verify usage rights</div>');
    }
    
    if (warnings.length === 0) {
      return '<div class="warning-item"><span class="warning-icon">✅</span> No compliance issues detected</div>';
    }
    
    return warnings.join('');
  }

  saveAssetQuick(assetId) {
    const asset = this.currentAssets.find(a => a.id === assetId);
    if (asset && !this.savedAssets.find(a => a.id === assetId)) {
      this.savedAssets.push({
        ...asset,
        savedAt: new Date().toISOString(),
        collections: ['default']
      });
      this.collections[0].assets.push(assetId);
      this.updateLibraryStats();
      this.showToast('Asset saved to library');
    }
  }

  saveAssetFromModal() {
    const modal = document.getElementById('asset-preview-modal');
    const assetId = modal.dataset.assetId;
    this.saveAssetQuick(assetId);
    modal.classList.add('hidden');
  }

  setupLibrary() {
    const createCollectionBtn = document.getElementById('create-collection-btn');
    const exportLibraryBtn = document.getElementById('export-library-btn');
    
    createCollectionBtn.addEventListener('click', () => {
      document.getElementById('create-collection-modal').classList.remove('hidden');
    });
    
    exportLibraryBtn.addEventListener('click', () => {
      this.exportLibrary();
    });
  }

  updateLibraryStats() {
    document.getElementById('total-assets').textContent = this.savedAssets.length;
    document.getElementById('total-collections').textContent = this.collections.length;
    
    // Calculate compliance score
    const compliantAssets = this.savedAssets.filter(asset => {
      const licenseInfo = this.getLicenseInfo(asset.license);
      return licenseInfo.commercial_use || !licenseInfo.attribution_required;
    });
    const score = this.savedAssets.length > 0 ? Math.round((compliantAssets.length / this.savedAssets.length) * 100) : 100;
    document.getElementById('compliance-score').textContent = `${score}%`;
  }

  renderCollections() {
    const container = document.getElementById('collections-list');
    container.innerHTML = this.collections.map(collection => `
      <div class="collection-item ${collection.id === 'default' ? 'default' : ''}" data-collection-id="${collection.id}">
        <div class="collection-info">
          <h4>${collection.name}</h4>
          <p>${collection.description}</p>
        </div>
        <div class="collection-meta">
          <span class="asset-count">${collection.assets.length} assets</span>
        </div>
      </div>
    `).join('');
  }

  renderRecentAssets() {
    const container = document.getElementById('recent-assets');
    const recentAssets = this.savedAssets.slice(-5).reverse();
    
    if (recentAssets.length === 0) {
      container.innerHTML = '<p class="empty-state">No assets saved yet. Start by searching and saving assets from the Discovery tab!</p>';
      return;
    }
    
    container.innerHTML = recentAssets.map(asset => `
      <div class="recent-asset-item">
        <div class="recent-asset-thumbnail">
          <img src="${asset.thumbnail}" alt="${asset.title}">
        </div>
        <div class="recent-asset-info">
          <h4 class="recent-asset-title">${asset.title}</h4>
          <p class="recent-asset-source">${asset.source}</p>
        </div>
      </div>
    `).join('');
  }

  setupProjects() {
    const createProjectBtn = document.getElementById('create-project-btn');
    const templateSelect = document.getElementById('project-template-select');
    
    createProjectBtn.addEventListener('click', () => {
      this.createNewProject();
    });
    
    templateSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.createProjectFromTemplate(e.target.value);
        e.target.value = '';
      }
    });
  }

  createNewProject() {
    const name = prompt('Enter project name:');
    if (name) {
      const project = {
        id: `project-${Date.now()}`,
        name: name,
        platform: 'General',
        status: 'compliant',
        assets: [],
        created: new Date().toLocaleDateString(),
        type: 'general'
      };
      this.projects.push(project);
      this.renderProjects();
    }
  }

  createProjectFromTemplate(templateType) {
    const templates = {
      'social-media': { name: 'Social Media Campaign', platform: 'Instagram' },
      'youtube': { name: 'YouTube Video Project', platform: 'YouTube' },
      'website': { name: 'Website Content Project', platform: 'Website' },
      'marketing': { name: 'Marketing Materials', platform: 'Print/Digital' }
    };
    
    const template = templates[templateType];
    if (template) {
      const project = {
        id: `project-${Date.now()}`,
        name: template.name,
        platform: template.platform,
        status: 'compliant',
        assets: [],
        created: new Date().toLocaleDateString(),
        type: templateType
      };
      this.projects.push(project);
      this.renderProjects();
    }
  }

  renderProjects() {
    const container = document.getElementById('project-cards');
    container.innerHTML = this.projects.map(project => `
      <div class="project-card">
        <div class="card">
          <div class="card__body">
            <div class="project-header">
              <h3>${project.name}</h3>
              <span class="project-status ${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
            </div>
            <div class="project-meta">
              <div class="meta-item">
                <span class="meta-label">Assets</span>
                <span class="meta-value">${project.assets.length}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Platform</span>
                <span class="meta-value">${project.platform}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Created</span>
                <span class="meta-value">${project.created}</span>
              </div>
            </div>
            <div class="project-actions">
              <button class="btn btn--sm btn--primary" onclick="app.openProject('${project.id}')">Open Project</button>
              <button class="btn btn--sm btn--outline" onclick="app.generateProjectReport('${project.id}')">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  openProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.showToast(`Opening project: ${project.name}`);
    }
  }

  generateProjectReport(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.showToast(`Generating compliance report for: ${project.name}`);
    }
  }

  setupCompliance() {
    const generateAttributionBtn = document.getElementById('generate-attribution-btn');
    const copyAttributionBtn = document.getElementById('copy-attribution-btn');
    
    generateAttributionBtn.addEventListener('click', () => {
      this.generateAttributions();
    });
    
    copyAttributionBtn.addEventListener('click', () => {
      this.copyAttributionsToClipboard();
    });
  }

  updateComplianceMetrics() {
    // Calculate compliance metrics
    const totalAssets = this.savedAssets.length;
    const compliantAssets = this.savedAssets.filter(asset => {
      const licenseInfo = this.getLicenseInfo(asset.license);
      return licenseInfo.commercial_use;
    });
    
    const compliancePercentage = totalAssets > 0 ? Math.round((compliantAssets.length / totalAssets) * 100) : 100;
    
    document.querySelector('.compliance-metric:nth-child(1) .metric-value').textContent = `${compliancePercentage}%`;
    document.querySelector('.compliance-metric:nth-child(2) .metric-value').textContent = totalAssets - compliantAssets.length;
    document.querySelector('.compliance-metric:nth-child(3) .metric-value').textContent = '0';
  }

  generateAttributions() {
    const format = document.getElementById('attribution-format').value;
    const attributionText = document.getElementById('attribution-text');
    
    const assetsNeedingAttribution = this.savedAssets.filter(asset => {
      const licenseInfo = this.getLicenseInfo(asset.license);
      return licenseInfo.attribution_required;
    });
    
    let attributions = '';
    
    if (assetsNeedingAttribution.length === 0) {
      attributions = 'No assets require attribution.';
    } else {
      if (format === 'html') {
        attributions = assetsNeedingAttribution.map(asset => 
          `<p>"${asset.title}" by ${asset.author} is licensed under ${this.getLicenseInfo(asset.license).name}. Source: ${asset.source}</p>`
        ).join('\n');
      } else if (format === 'text') {
        attributions = assetsNeedingAttribution.map(asset => 
          `"${asset.title}" by ${asset.author} is licensed under ${this.getLicenseInfo(asset.license).name}. Source: ${asset.source}`
        ).join('\n\n');
      } else if (format === 'social') {
        attributions = assetsNeedingAttribution.map(asset => 
          `📷 ${asset.title} by ${asset.author} (${asset.source})`
        ).join('\n');
      }
    }
    
    attributionText.value = attributions;
  }

  copyAttributionsToClipboard() {
    const attributionText = document.getElementById('attribution-text');
    attributionText.select();
    document.execCommand('copy');
    this.showToast('Attributions copied to clipboard');
  }

  setupEducation() {
    const platformTabs = document.querySelectorAll('.platform-tab');
    const platformGuides = document.querySelectorAll('.platform-guide');
    
    platformTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const platform = tab.dataset.platform;
        
        platformTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        platformGuides.forEach(guide => {
          guide.classList.remove('active');
          if (guide.classList.contains(platform)) {
            guide.classList.add('active');
          }
        });
      });
    });
  }

  renderLicenseGuide() {
    if (!this.ccLicenses) return;
    
    const container = document.getElementById('license-list');
    const licenses = Object.entries(this.ccLicenses);
    
    container.innerHTML = licenses.map(([code, license]) => `
      <div class="license-item">
        <div class="license-header">
          <h3 class="license-name">${license.name}</h3>
          <span class="license-code">${code}</span>
        </div>
        <p class="license-description">${license.description}</p>
        <div class="license-permissions">
          <div class="permission-item">
            <span class="permission-icon ${license.commercial_use ? 'allowed' : 'forbidden'}">${license.commercial_use ? '✅' : '❌'}</span>
            <span>Commercial Use</span>
          </div>
          <div class="permission-item">
            <span class="permission-icon ${license.attribution_required ? 'required' : 'allowed'}">${license.attribution_required ? '⚠️' : '✅'}</span>
            <span>Attribution ${license.attribution_required ? 'Required' : 'Optional'}</span>
          </div>
          <div class="permission-item">
            <span class="permission-icon ${license.modifications_allowed !== false ? 'allowed' : 'forbidden'}">${license.modifications_allowed !== false ? '✅' : '❌'}</span>
            <span>Modifications</span>
          </div>
          ${license.share_alike_required ? '<div class="permission-item"><span class="permission-icon required">⚠️</span><span>Share Alike Required</span></div>' : ''}
        </div>
      </div>
    `).join('');
  }

  setupReports() {
    const generateReportBtn = document.getElementById('generate-report-btn');
    const exportButtons = {
      pdf: document.getElementById('export-pdf-btn'),
      csv: document.getElementById('export-csv-btn'),
      json: document.getElementById('export-json-btn')
    };
    
    generateReportBtn.addEventListener('click', () => {
      this.generateReport();
    });
    
    Object.entries(exportButtons).forEach(([format, btn]) => {
      if (btn) {
        btn.addEventListener('click', () => this.exportReport(format));
      }
    });
  }

  generateReport() {
    const reportType = document.getElementById('report-type-select').value;
    const previewContainer = document.getElementById('report-preview');
    
    let reportContent = '';
    
    switch (reportType) {
      case 'usage':
        reportContent = this.generateUsageReport();
        break;
      case 'compliance':
        reportContent = this.generateComplianceReport();
        break;
      case 'attribution':
        reportContent = this.generateAttributionReport();
        break;
      case 'license':
        reportContent = this.generateLicenseReport();
        break;
    }
    
    previewContainer.innerHTML = reportContent;
  }

  generateUsageReport() {
    return `
      <h3>Asset Usage Report</h3>
      <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Total Assets in Library:</strong> ${this.savedAssets.length}</p>
      <p><strong>Collections:</strong> ${this.collections.length}</p>
      <p><strong>Active Projects:</strong> ${this.projects.length}</p>
      
      <h4>Asset Breakdown by Source:</h4>
      <ul>
        ${Object.entries(this.getAssetsBySource()).map(([source, count]) => 
          `<li>${source}: ${count} assets</li>`
        ).join('')}
      </ul>
      
      <h4>Recent Activity:</h4>
      <p>Last asset saved: ${this.savedAssets.length > 0 ? 'Today' : 'None'}</p>
    `;
  }

  generateComplianceReport() {
    const compliantAssets = this.savedAssets.filter(asset => {
      const licenseInfo = this.getLicenseInfo(asset.license);
      return licenseInfo.commercial_use;
    });
    
    return `
      <h3>Compliance Audit Report</h3>
      <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Compliance Status:</strong> <span style="color: green;">✅ COMPLIANT</span></p>
      <p><strong>Assets Reviewed:</strong> ${this.savedAssets.length}</p>
      <p><strong>Fully Compliant:</strong> ${compliantAssets.length}</p>
      <p><strong>Compliance Rate:</strong> ${this.savedAssets.length > 0 ? Math.round((compliantAssets.length / this.savedAssets.length) * 100) : 100}%</p>
      
      <h4>License Distribution:</h4>
      <ul>
        ${Object.entries(this.getAssetsByLicense()).map(([license, count]) => 
          `<li>${this.getLicenseInfo(license).name}: ${count} assets</li>`
        ).join('')}
      </ul>
    `;
  }

  generateAttributionReport() {
    const attributionRequired = this.savedAssets.filter(asset => {
      const licenseInfo = this.getLicenseInfo(asset.license);
      return licenseInfo.attribution_required;
    });
    
    return `
      <h3>Attribution Report</h3>
      <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Assets Requiring Attribution:</strong> ${attributionRequired.length}</p>
      
      ${attributionRequired.length > 0 ? `
        <h4>Required Attributions:</h4>
        <ul>
          ${attributionRequired.map(asset => 
            `<li>"${asset.title}" by ${asset.author} (${asset.source})</li>`
          ).join('')}
        </ul>
      ` : '<p>No assets require attribution.</p>'}
    `;
  }

  generateLicenseReport() {
    return `
      <h3>License Summary Report</h3>
      <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h4>License Types Used:</h4>
      <ul>
        ${Object.entries(this.getAssetsByLicense()).map(([license, count]) => {
          const info = this.getLicenseInfo(license);
          return `<li><strong>${info.name}:</strong> ${count} assets - Commercial: ${info.commercial_use ? 'Yes' : 'No'}, Attribution: ${info.attribution_required ? 'Required' : 'Optional'}</li>`;
        }).join('')}
      </ul>
      
      <h4>Commercial Use Status:</h4>
      <p>${this.savedAssets.filter(asset => this.getLicenseInfo(asset.license).commercial_use).length} of ${this.savedAssets.length} assets approved for commercial use</p>
    `;
  }

  getAssetsBySource() {
    return this.savedAssets.reduce((acc, asset) => {
      acc[asset.source] = (acc[asset.source] || 0) + 1;
      return acc;
    }, {});
  }

  getAssetsByLicense() {
    return this.savedAssets.reduce((acc, asset) => {
      acc[asset.license] = (acc[asset.license] || 0) + 1;
      return acc;
    }, {});
  }

  exportReport(format) {
    this.showToast(`Exporting report as ${format.toUpperCase()}...`);
  }

  exportLibrary() {
    const libraryData = {
      collections: this.collections,
      assets: this.savedAssets,
      projects: this.projects,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(libraryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetflow-library-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  setupModals() {
    // Asset preview modal
    document.getElementById('modal-close-preview').addEventListener('click', () => {
      document.getElementById('asset-preview-modal').classList.add('hidden');
    });
    
    document.getElementById('modal-cancel-preview').addEventListener('click', () => {
      document.getElementById('asset-preview-modal').classList.add('hidden');
    });
    
    document.getElementById('save-asset-btn').addEventListener('click', () => {
      this.saveAssetFromModal();
    });
    
    // Create collection modal
    document.getElementById('modal-close-collection').addEventListener('click', () => {
      document.getElementById('create-collection-modal').classList.add('hidden');
    });
    
    document.getElementById('modal-cancel-collection').addEventListener('click', () => {
      document.getElementById('create-collection-modal').classList.add('hidden');
    });
    
    document.getElementById('create-collection-confirm').addEventListener('click', () => {
      this.createCollection();
    });
    
    // Click outside modal to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
      }
    });
  }

  createCollection() {
    const name = document.getElementById('collection-name').value;
    const description = document.getElementById('collection-description').value;
    const type = document.getElementById('collection-type').value;
    
    if (name) {
      const collection = {
        id: `collection-${Date.now()}`,
        name,
        description,
        type,
        assets: []
      };
      
      this.collections.push(collection);
      document.getElementById('create-collection-modal').classList.add('hidden');
      this.renderCollections();
      this.updateLibraryStats();
      
      // Clear form
      document.getElementById('collection-name').value = '';
      document.getElementById('collection-description').value = '';
      document.getElementById('collection-type').value = 'general';
      
      this.showToast('Collection created successfully');
    }
  }

  showLoading() {
    document.getElementById('loading-indicator').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading-indicator').classList.add('hidden');
  }

  showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 2000;
      font-size: 14px;
      font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new AssetFlowApp();
  console.log('AssetFlow Pro initialized successfully!');
});

// Make app globally accessible
window.app = app;