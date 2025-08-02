import Patient from '../models/Patient.js';

// Mock diagnosis logic based on symptoms
const getDiagnosis = (symptoms) => {
  // Convert symptoms to lowercase for easier matching
  const lowerSymptoms = symptoms.map(symptom => symptom.toLowerCase());
  
  // Complex diagnosis patterns (check these first)
  if (lowerSymptoms.includes('chest pain') && lowerSymptoms.includes('shortness of breath')) {
    return 'Possible Heart Condition - Seek immediate medical attention';
  }
  
  if (lowerSymptoms.includes('severe headache') && lowerSymptoms.includes('neck stiffness')) {
    return 'Possible Meningitis - Seek immediate medical attention';
  }
  
  if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough') && lowerSymptoms.includes('fatigue')) {
    return 'Possible Flu - Rest and stay hydrated';
  }
  
  if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('sore throat') && lowerSymptoms.includes('swollen glands')) {
    return 'Possible Strep Throat - Consider antibiotic treatment';
  }
  
  if (lowerSymptoms.includes('runny nose') && lowerSymptoms.includes('sneezing') && lowerSymptoms.includes('cough')) {
    return 'Common Cold - Rest and fluids recommended';
  }
  
  if (lowerSymptoms.includes('nausea') && lowerSymptoms.includes('vomiting') && lowerSymptoms.includes('diarrhea')) {
    return 'Gastroenteritis - Stay hydrated and rest';
  }
  
  if (lowerSymptoms.includes('headache') && lowerSymptoms.includes('muscle aches') && lowerSymptoms.includes('fatigue')) {
    return 'Possible Viral Infection - Rest and monitor symptoms';
  }
  
  // Single symptom patterns
  if (lowerSymptoms.includes('fever')) {
    return 'Fever - Monitor temperature and stay hydrated';
  }
  
  if (lowerSymptoms.includes('headache')) {
    return 'Headache - Rest and consider over-the-counter pain relief';
  }
  
  if (lowerSymptoms.includes('cough')) {
    return 'Cough - Stay hydrated and rest';
  }
  
  if (lowerSymptoms.includes('sore throat')) {
    return 'Sore Throat - Gargle with warm salt water';
  }
  
  if (lowerSymptoms.includes('fatigue')) {
    return 'Fatigue - Ensure adequate rest and nutrition';
  }
  
  if (lowerSymptoms.includes('chest pain')) {
    return 'Chest Pain - Seek medical attention promptly';
  }
  
  if (lowerSymptoms.includes('shortness of breath')) {
    return 'Breathing Difficulty - Seek medical attention';
  }
  
  if (lowerSymptoms.includes('abdominal pain')) {
    return 'Abdominal Pain - Monitor and consider medical evaluation';
  }
  
  // Default diagnosis
  return 'General Symptoms - Consider consulting a healthcare provider for proper evaluation';
};

// @desc    Analyze symptoms and provide diagnosis
// @route   POST /api/triage/analyze
// @access  Private
const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    // Validate input
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid symptoms array',
      });
    }
    
    // Extract symptom names if they're objects
    const symptomNames = symptoms.map(symptom => 
      typeof symptom === 'object' ? symptom.name : symptom
    ).filter(name => typeof name === 'string' && name.trim().length > 0);
    
    if (symptomNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one valid symptom',
      });
    }
    
    // Get diagnosis using mock logic
    const diagnosis = getDiagnosis(symptomNames);
    
    // Save to database
    const patientRecord = await Patient.create({
      user: req.user.id,
      symptoms: symptoms, // Save the original symptom objects
      diagnosis,
      date: new Date(),
    });
    
    // Transform the response to match frontend expectations
    const response = {
      _id: patientRecord._id,
      symptoms: symptoms,
      priority: getPriorityFromDiagnosis(diagnosis),
      recommendation: {
        message: diagnosis
      },
      createdAt: patientRecord.date
    };
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('Analyze symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during symptom analysis',
    });
  }
};

// @desc    Get triage history for logged-in user
// @route   GET /api/triage/history
// @access  Private
const getTriageHistory = async (req, res) => {
  try {
    // Get all triage records for the logged-in user, sorted by date (newest first)
    const triageHistory = await Patient.find({ user: req.user.id })
      .sort({ date: -1 })
      .select('symptoms diagnosis date createdAt');
    
    res.status(200).json({
      success: true,
      message: 'Triage history retrieved successfully',
      data: {
        history: triageHistory,
        count: triageHistory.length,
      },
    });
    
  } catch (error) {
    console.error('Get triage history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving triage history',
    });
  }
};

// @desc    Get single triage result by ID
// @route   GET /api/triage/results/:id
// @access  Private
const getTriageResult = async (req, res) => {
  try {
    const result = await Patient.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Triage result not found'
      });
    }

    // Transform the data to match frontend expectations
    const response = {
      _id: result._id,
      symptoms: result.symptoms,
      priority: getPriorityFromDiagnosis(result.diagnosis),
      recommendation: {
        message: result.diagnosis
      },
      createdAt: result.date || result.createdAt
    };

    res.status(200).json(response);
    
  } catch (error) {
    console.error('Get triage result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving triage result'
    });
  }
};

// Helper function to determine priority from diagnosis
const getPriorityFromDiagnosis = (diagnosis) => {
  const lowercaseDiagnosis = diagnosis.toLowerCase();
  if (lowercaseDiagnosis.includes('immediate') || 
      lowercaseDiagnosis.includes('emergency') || 
      lowercaseDiagnosis.includes('seek medical attention promptly')) {
    return 'High';
  }
  if (lowercaseDiagnosis.includes('consider medical') || 
      lowercaseDiagnosis.includes('monitor')) {
    return 'Medium';
  }
  return 'Low';
};

export { analyzeSymptoms, getTriageHistory, getTriageResult };